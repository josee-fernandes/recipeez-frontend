import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/contexts/auth'
import { api } from '@/lib/axios'

export const Route = createFileRoute('/_auth/sign-in')({
	component: RouteComponent,
})

function RouteComponent() {
	const { updateUserToken } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value)
	}

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		try {
			const body = {
				email,
				password,
			}

			const { data } = await api.post('/auth/sign-in', body)

			updateUserToken(data.token)
			localStorage.setItem('@recipeez-0.0.1:token', data.token)
			navigate({ to: '/recipes' })
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="max-w-[1200px] mx-auto py-4 w-full h-screen flex flex-col items-center justify-center">
			<div className="border-2 flex flex-col gap-4 p-8 rounded-lg shadow-2xl w-full max-w-96">
				<h1 className="text-2xl font-bold text-center">Recipeez</h1>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<Input id="email" type="email" placeholder="E-mail" value={email} onChange={handleEmailChange} />

					<Input id="password" type="password" placeholder="Senha" value={password} onChange={handlePasswordChange} />
					<Button type="submit">Entrar</Button>
				</form>
			</div>
		</div>
	)
}
