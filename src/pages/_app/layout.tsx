import { createFileRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { useEffect, useMemo } from 'react'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/axios'
import { useAuthStore } from '@/stores/auth'

export const Route = createFileRoute('/_app')({
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate()
	const { isAuthenticated, clearMemoryUser } = useAuthStore()
	const user = useAuthStore((state) => state.user)

	const userNameFallback = useMemo(
		() =>
			user?.name
				.split(' ')
				.map((letter) => letter[0])
				.join('')
				.toUpperCase() ?? 'RC', // Recipeez
		[user?.name],
	)

	function handleSignOut() {
		clearMemoryUser()
		navigate({ to: '/sign-in', replace: true })
	}

	useEffect(() => {
		if (!isAuthenticated) {
			navigate({ to: '/sign-in', replace: true })
			return
		}

		const responseInterceptorId = api.interceptors.response.use(
			(response) => response,
			(error) => {
				if (isAxiosError(error)) {
					const status = error.response?.status

					if (status === 401) {
						clearMemoryUser()
						navigate({ to: '/sign-in', replace: true })
					}
				}
			},
		)

		return () => {
			api.interceptors.response.eject(responseInterceptorId)
		}
	}, [])

	return (
		<div className="w-full h-screen overflow-hidden flex flex-col">
			<nav className="flex justify-between w-full p-4 items-center">
				<h1 className="text-2xl font-bold">Recipeez</h1>
				<div className="flex items-center gap-4">
					<Link to="/recipes">Receitas</Link>
					<Link to="/recipes/new">Nova Receita</Link>
					<ThemeToggle />
					<Avatar>
						<AvatarImage src="" alt="User" />
						<AvatarFallback>{userNameFallback}</AvatarFallback>
					</Avatar>
					<Button type="button" variant="destructive" onClick={handleSignOut}>
						Sair
					</Button>
				</div>
			</nav>
			<div className="w-full h-full overflow-x-hidden overflow-y-auto flex-1">
				<Outlet />
			</div>
		</div>
	)
}
