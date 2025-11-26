import { AxiosError } from 'axios'
import { format } from 'date-fns'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'

import { CreateRecipeForm } from '@/components/CreateRecipeForm'
import { useAuth } from '@/contexts/Auth'
import { api } from '@/lib/axios'

export const Recipes: React.FC = () => {
	const { userToken, updateUserToken } = useAuth()
	const navigate = useNavigate()

	const [recipes, setRecipes] = useState<IRecipe[]>([])

	const handleLoadRecipes = useCallback(async () => {
		try {
			const response = await api.get('/recipes')
			const { data } = response

			setRecipes(data)
		} catch (error) {
			if (error instanceof AxiosError) {
				console.log({ error })
				if (error.response?.data?.error === 'jwt expired') {
					console.log('jwt expired')

					updateUserToken(null)

					navigate('/auth/sign-in')
				}
			}
		}
	}, [updateUserToken, navigate])

	const onRecipeCreated = () => {
		handleLoadRecipes()
	}

	const handleSignOut = () => {
		updateUserToken(null)
		navigate('/auth/sign-in')
	}

	useEffect(() => {
		if (userToken) {
			handleLoadRecipes()
		}
	}, [userToken, handleLoadRecipes])

	return (
		<div className="py-4 max-w-[1200px] mx-auto">
			<button type="button" className="bg-red-500 text-white p-2 rounded-lg max-w-72" onClick={handleSignOut}>
				Sair
			</button>
			<CreateRecipeForm onCreate={onRecipeCreated} />
			<hr className="my-4 border-zinc-300" />
			<div>
				<ul className="flex flex-wrap gap-4">
					{recipes.map((recipe) => (
						<li key={recipe.id} className="flex flex-col">
							<article className="flex flex-col gap-2 border-2 border-zinc-300 rounded-lg p-4 max-w-96 w-96 h-128">
								<header className="">
									<img src={recipe.photo} alt={recipe.title} className="w-full h-40 object-cover rounded-lg" />
									<h3 className="text-2xl font-bold">{recipe.title}</h3>
									<p className="text-sm text-zinc-500">{recipe.description}</p>
								</header>
								<section className="flex flex-col gap-4 overflow-x-auto">
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
										<p className="text-base text-zinc-950">{recipe.instructions}</p>
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

Recipes.displayName = 'Recipes'
