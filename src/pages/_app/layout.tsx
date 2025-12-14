import { createFileRoute, Link, Outlet, useNavigate } from '@tanstack/react-router'
import { isAxiosError } from 'axios'
import { useEffect, useMemo } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
			user?.token
				.split(' ')
				.map((letter) => letter[0])
				.join('')
				.toUpperCase() ?? 'RC', // Recipeez
		[user?.token],
	)

	function handleSignOut() {
		clearMemoryUser()
		navigate({ to: '/sign-in', replace: true, search: { email: '' } })
	}

	useEffect(() => {
		if (!isAuthenticated) {
			navigate({ to: '/sign-in', replace: true, search: { email: '' } })
			return
		}

		const responseInterceptorId = api.interceptors.response.use(
			(response) => response,
			(error) => {
				if (isAxiosError(error)) {
					const status = error.response?.status

					if (status === 401) {
						clearMemoryUser()
						navigate({ to: '/sign-in', replace: true, search: { email: '' } })
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
			<nav className="flex justify-between w-full p-4 bg-zinc-950 items-center">
				<h1 className="text-2xl font-bold text-white">Recipeez</h1>
				<div className="flex items-center gap-4">
					<Link to="/recipes" className="text-white">
						Receitas
					</Link>
					<Link to="/recipes/new" className="text-white">
						Nova Receita
					</Link>
					<Avatar>
						<AvatarImage src="" alt="User" />
						<AvatarFallback>{userNameFallback}</AvatarFallback>
					</Avatar>
					<button
						type="button"
						className="bg-rose-500 hover:bg-rose-700 text-white p-2 rounded-lg max-w-72 transition-all cursor-pointer"
						onClick={handleSignOut}
					>
						Sair
					</button>
				</div>
			</nav>
			<div className="w-full h-full overflow-x-hidden overflow-y-auto flex-1">
				<Outlet />
			</div>
		</div>
	)
}
