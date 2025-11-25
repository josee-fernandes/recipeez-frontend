import { format } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/axios'

interface IRecipe {
	id: string
	title: string
	description: string
	photo: string
	ingredients: string[]
	instructions: string
	createdAt: string
	updatedAt: string
}

export const App: React.FC = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [userToken, setUserToken] = useState<string | null>(null)
	const [recipes, setRecipes] = useState<IRecipe[]>([])

	const checkAuthentication = useCallback(() => {
		const token = localStorage.getItem('@recipeez-0.0.1:token')

		if (token) {
			api.defaults.headers.common.Authorization = `Bearer ${token}`
			setUserToken(token)
		}
	}, [])

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

			setUserToken(data.token)
			localStorage.setItem('@recipeez-0.0.1:token', data.token)
		} catch (error) {
			console.error(error)
		}
	}

	const handleLoadRecipes = useCallback(async () => {
		try {
			const { data } = await api.get('/recipes')

			setRecipes(data)
		} catch (error) {
			console.error(error)
		}
	}, [])

	useEffect(() => {
		checkAuthentication()
	}, [checkAuthentication])

	useEffect(() => {
		if (userToken) {
			handleLoadRecipes()
		}
	}, [userToken, handleLoadRecipes])

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label>
					E-mail
					<input
						type="email"
						className="border-2 border-gray-300 rounded-md p-2"
						value={email}
						onChange={handleEmailChange}
					/>
				</label>
				<label>
					Senha
					<input
						type="password"
						className="border-2 border-gray-300 rounded-md p-2"
						value={password}
						onChange={handlePasswordChange}
					/>
				</label>
				<button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
					Entrar
				</button>
			</form>
			<div>
				<ul className="flex flex-wrap gap-4">
					{recipes.map((recipe) => (
						<li key={recipe.id}>
							<article className="flex flex-col gap-2 border-2 border-zinc-300 rounded-lg p-4 max-w-96">
								<header>
									<img src={recipe.photo} alt={recipe.title} className="w-full h-40 object-cover rounded-lg" />
									<h3 className="text-2xl font-bold">{recipe.title}</h3>
									<p className="text-sm text-zinc-500">{recipe.description}</p>
								</header>
								<section className="flex flex-col gap-4">
									<div>
										<h4 className="text-lg font-bold">Ingredientes</h4>
										<ul>
											{recipe.ingredients.map((ingredient) => (
												<li key={`${recipe.id}-${ingredient}`}>{ingredient}</li>
											))}
										</ul>
									</div>

									<div>
										<h4 className="text-lg font-bold">Modo de preparo</h4>
										<p className="text-sm text-zinc-500">{recipe.instructions}</p>
									</div>
								</section>
								<footer>
									<p className="text-sm text-zinc-500">
										adicionado em: {format(new Date(recipe.createdAt), 'dd/MM/yyyy')}
									</p>
									<p className="text-sm text-zinc-500">
										última atualização: {format(new Date(recipe.updatedAt), 'dd/MM/yyyy')}
									</p>
								</footer>
							</article>
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}

App.displayName = 'App'
