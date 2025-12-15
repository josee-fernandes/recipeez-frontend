import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { format } from 'date-fns'

import { getRecipes } from '@/api/get-recipes'
import { RecipesSkeleton } from '@/components/recipes-skeleton'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

export const Route = createFileRoute('/_app/recipes/')({
	component: RouteComponent,
})

function RouteComponent() {
	const { clearMemoryUser } = useAuthStore()
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
				clearMemoryUser()

				navigate({ to: '/sign-in', search: { email: '' } })
			}
		}
	}

	return (
		<div className="max-w-[1200px] mx-auto py-4">
			<ul className="flex flex-wrap gap-4">
				{isRecipesLoading && <RecipesSkeleton />}
				{recipes?.map((recipe) => (
					<li key={recipe.id} className="flex flex-col">
						<Button
							variant="ghost"
							className="h-max w-96 p-4 cursor-pointer border"
							onClick={() => navigate({ to: '/recipes/$id', params: { id: recipe.id } })}
						>
							<article className="flex flex-col gap-2 rounded-lg w-full">
								<header>
									<img src={recipe.photo} alt={recipe.title} className="w-full h-40 object-cover rounded-lg" />
									<h3 className="text-2xl font-bold w-max">{recipe.title}</h3>
									<p className="text-sm text-zinc-500 truncate w-max">{recipe.description}</p>
								</header>
							</article>
						</Button>
					</li>
				))}
			</ul>
		</div>
	)
}
