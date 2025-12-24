import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { signIn } from '@/api/sign-in'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group'
import { useAuthStore } from '@/stores/auth'

const signInSearchSchema = z.object({
	email: z.string().optional(),
})

export const Route = createFileRoute('/_auth/sign-in')({
	component: RouteComponent,
	validateSearch: signInSearchSchema,
})

const signInFormSchema = z.object({
	email: z.email({ message: 'E-mail inválido' }),
	password: z.string().min(1, { message: 'Senha é obrigatória' }),
})

type SignInFormValues = z.infer<typeof signInFormSchema>

function RouteComponent() {
	const navigate = useNavigate()
	const { email = '' } = Route.useSearch()
	const { setMemoryUser } = useAuthStore()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<SignInFormValues>({
		resolver: zodResolver(signInFormSchema),
		defaultValues: {
			email: email,
			password: '',
		},
	})

	const { mutateAsync: authenticate, isPending: isAuthenticating } = useMutation({
		mutationFn: signIn,
		onSuccess: (response) => {
			setMemoryUser(response)
			navigate({ to: '/recipes', replace: true })
		},
		onError: () => {
			toast.error('Credenciais inválidas')
		},
	})

	const [isVisible, setIsVisible] = useState(false)

	async function handleSignIn(data: SignInFormValues) {
		await authenticate({ email: data.email, password: data.password })
	}

	function handleFormErrors() {
		toast.error('Erro ao preencher o formulário', {
			description: (
				<div className="flex flex-col">
					{Object.entries(errors).map(([key, value]) => (
						<p key={key}>{value.message}</p>
					))}
				</div>
			),
			duration: 5000,
		})
	}

	function handleTogglePasswordVisibility() {
		setIsVisible((oldIsVisible) => !oldIsVisible)
	}

	useEffect(() => {
		if (Object.keys(errors).length > 0) {
			handleFormErrors()
		}
	}, [errors])

	return (
		<div className="max-w-[1200px] mx-auto py-4 w-full h-screen flex flex-col items-center justify-center">
			<div className="flex flex-col gap-4 p-8 rounded-lg shadow-2xl w-full max-w-96">
				<h1 className="text-2xl font-bold text-center">Recipeez</h1>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit(handleSignIn)}>
					<Input id="email" type="email" placeholder="E-mail" disabled={isAuthenticating} {...register('email')} />

					<InputGroup>
						<InputGroupInput
							type={isVisible ? 'text' : 'password'}
							placeholder="Senha"
							disabled={isAuthenticating}
							{...register('password')}
						/>
						<InputGroupAddon align="inline-end">
							<InputGroupButton
								aria-label="Ver senha"
								title="Ver senha"
								size="icon-sm"
								disabled={isAuthenticating}
								onClick={handleTogglePasswordVisibility}
							>
								{isVisible ? <EyeOff /> : <Eye />}
							</InputGroupButton>
						</InputGroupAddon>
					</InputGroup>
					<Button type="submit" disabled={isAuthenticating}>
						{isAuthenticating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar'}
					</Button>
				</form>
			</div>
		</div>
	)
}
