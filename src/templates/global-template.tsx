import { Link, Outlet, useNavigate } from 'react-router'
import { useAuth } from '@/contexts/auth'

export const GlobalTemplate: React.FC = () => {
	const { updateUserToken } = useAuth()
	const navigate = useNavigate()

	const handleSignOut = () => {
		updateUserToken(null)
		navigate('/auth/sign-in')
	}

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

GlobalTemplate.displayName = 'GlobalTemplate'
