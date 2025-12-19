import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { Image, Plus } from 'lucide-react'
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
		<div className="max-w-[1200px] mx-auto p-4 flex">
			<ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto">
				{isRecipesLoading && <RecipesSkeleton />}
				{!isRecipesLoading && (
					<li className="flex flex-col">
						<Button
							variant="ghost"
							className="h-61.5 max-w-96 p-4 cursor-pointer border border-dashed bg-card"
							onClick={() => navigate({ to: '/recipes/new' })}
						>
							<Plus className="size-6" />
							Nova Receita
						</Button>
					</li>
				)}
				{recipes?.map((recipe) => (
					<li key={recipe.id} className="flex flex-col">
						<Button
							variant="ghost"
							className="h-61.5 max-w-96 w-full p-4 cursor-pointer border flex flex-col items-start justify-start text-left bg-card"
							onClick={() => navigate({ to: '/recipes/$recipeId', params: { recipeId: recipe.id } })}
						>
							<article className="flex flex-col gap-2 rounded-lg w-full min-w-0">
								{recipe.photo ? (
									<img src={recipe.photo} alt={recipe.title} className="w-full h-40 object-cover rounded-lg" />
								) : (
									<div className="w-full h-40 flex items-center justify-center border rounded-lg bg-background/60">
										<Image className="size-10" />
									</div>
								)}
								<div className="w-full min-w-0 overflow-hidden">
									<h3 className="text-2xl font-bold w-full truncate text-left">{recipe.title}</h3>
									<p className="text-sm text-zinc-500 truncate w-full text-left">{recipe.description}</p>
								</div>
							</article>
						</Button>
					</li>
				))}
			</ul>
		</div>
	)
}
