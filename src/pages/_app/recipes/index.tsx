import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { format } from 'date-fns'

import { getRecipes } from '@/api/get-recipes'
import { useAuth } from '@/contexts/auth'

export const Route = createFileRoute('/_app/recipes/')({
	component: RouteComponent,
})

function RouteComponent() {
	const { updateUserToken } = useAuth()
	const navigate = useNavigate()

	const {
		data: recipes,
		isPending: isRecipesLoading,
		error: recipesError,
	} = useQuery({
		queryKey: ['recipes'],
		queryFn: getRecipes,
		staleTime: 1000 * 60 * 5,
	})

	if (recipesError) {
		if (recipesError instanceof AxiosError) {
			if (recipesError.response?.data?.error === 'jwt expired') {
				updateUserToken(null)

				navigate({ to: '/sign-in' })
			}
		}
	}

	if (isRecipesLoading) {
		return <div>Carregando...</div>
	}

	return (
		<div className="max-w-[1200px] mx-auto py-4">
			<ul className="flex flex-wrap gap-4">
				{recipes?.map((recipe) => (
					<li key={recipe.id} className="flex flex-col">
						<article className="flex flex-col gap-2 border-2 rounded-lg p-4 max-w-96 w-96 h-128">
							<header className=''>
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
	)
}
