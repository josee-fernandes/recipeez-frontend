import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { AxiosError } from 'axios'
import { Image } from 'lucide-react'
import { useMemo } from 'react'
import z from 'zod'

import { getRecipes } from '@/api/get-recipes'
import { Pagination } from '@/components/pagination'
import { RecipesSearch } from '@/components/recipes/search'
import { RecipesSkeleton } from '@/components/recipes-skeleton'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

const recipesSearchSchema = z.object({
	page: z.number().optional(),
	recipeName: z.string().optional(),
})

export const Route = createFileRoute('/_app/recipes/')({
	component: RouteComponent,
	validateSearch: recipesSearchSchema,
})

function RouteComponent() {
	const { clearMemoryUser } = useAuthStore()
	const navigate = useNavigate()
	const { page = 1, recipeName = '' } = Route.useSearch()

	const pageIndex = useMemo(() => Math.max(page - 1, 0), [page])

	const {
		data: result,
		isPending: isRecipesLoading,
		error: recipesError,
	} = useQuery({
		queryKey: ['recipes', pageIndex, recipeName],
		queryFn: () => getRecipes({ pageIndex: pageIndex ?? 0, recipeName: recipeName ?? '' }),
		staleTime: 1000 * 60 * 5,
	})

	if (recipesError) {
		if (recipesError instanceof AxiosError) {
			if (recipesError.response?.data?.error === 'jwt expired') {
				clearMemoryUser()

				navigate({ to: '/sign-in', search: (oldSearch) => ({ ...oldSearch, email: '' }) })
			}
		}
	}

	return (
		<div className="max-w-[1200px] mx-auto p-4 flex flex-col gap-4">
			<RecipesSearch />
			<ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mx-auto">
				{isRecipesLoading && <RecipesSkeleton />}
				{result?.recipes.map((recipe) => (
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
			{!isRecipesLoading && result?.meta && (
				<Pagination
					pageIndex={result.meta.pageIndex}
					perPage={result.meta.perPage}
					totalCount={result.meta.totalCount}
				/>
			)}
		</div>
	)
}
