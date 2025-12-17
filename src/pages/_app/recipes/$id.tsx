import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { Loader2, PencilIcon, TrashIcon } from 'lucide-react'
import { toast } from 'sonner'
import { deleteRecipe } from '@/api/delete-recipe'
import { getRecipe } from '@/api/get-recipe'
import type { TGetRecipesResponse } from '@/api/get-recipes'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_app/recipes/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()
	const navigate = useNavigate()
	const queryClient = useQueryClient()

	const {
		data: recipe,
		isPending: isRecipeLoading,
		error: recipeError,
	} = useQuery({
		queryKey: ['recipe', id],
		queryFn: () => getRecipe(id),
	})

	function updateRecipeCache(recipeId: string) {
		const recipesListCache = queryClient.getQueriesData<TGetRecipesResponse>({
			queryKey: ['recipes'],
		})

		for (const [cacheKey, cacheData] of recipesListCache) {
			if (!cacheData) return

			queryClient.setQueryData<TGetRecipesResponse>(
				cacheKey,
				cacheData.filter((recipe) => recipe.id !== recipeId),
			)
		}
	}

	const { mutateAsync: deleteRecipeFn, isPending: isDeletingRecipe } = useMutation({
		mutationFn: deleteRecipe,
		onSuccess(_, { recipeId }) {
			toast.success('Receita deletada com sucesso')

			updateRecipeCache(recipeId)
			navigate({ to: '/recipes', replace: true })
		},
		onError: () => {
			toast.error('Erro ao deletar receita')
		},
	})

	async function handleDeleteRecipe(id: string) {
		await deleteRecipeFn({ recipeId: id })
	}

	if (isRecipeLoading) {
		return <div>Loading...</div>
	}

	if (recipeError) {
		return <div>Error: {recipeError.message}</div>
	}

	return (
		<div className="max-w-[1200px] mx-auto py-4">
			<article className="flex flex-col gap-2 border-2 rounded-lg p-4 max-w-96 w-96 min-h-128">
				<header className="">
					<img src={recipe.photo} alt={recipe.title} className="w-full h-40 object-cover rounded-lg" />
					<h3 className="text-2xl font-bold">{recipe.title}</h3>
					<p className="text-sm text-zinc-500 text-left wrap-break-word">{recipe.description}</p>
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
						<p className="text-base text-zinc-950">{recipe.instructions}</p>
					</div>
				</section>
				<footer>
					<p className="text-sm text-zinc-500">adicionado em: {format(new Date(recipe.createdAt), 'dd/MM/yyyy')}</p>
					<p className="text-sm text-zinc-500">
						última atualização: {format(new Date(recipe.updatedAt), 'dd/MM/yyyy')}
					</p>
				</footer>
			</article>
			<ul>
				<li>
					<Button variant="outline" size="icon" disabled={isDeletingRecipe}>
						<PencilIcon className="w-4 h-4" />
					</Button>
					<Button variant="destructive" size="icon" disabled={isDeletingRecipe} onClick={() => handleDeleteRecipe(id)}>
						{isDeletingRecipe ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrashIcon className="w-4 h-4" />}
					</Button>
				</li>
			</ul>
		</div>
	)
}
