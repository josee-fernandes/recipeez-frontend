import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { format } from 'date-fns'
import { getRecipe } from '@/api/get-recipe'

export const Route = createFileRoute('/_app/recipes/$id')({
	component: RouteComponent,
})

function RouteComponent() {
	const { id } = Route.useParams()

	const {
		data: recipe,
		isPending: isRecipeLoading,
		error: recipeError,
	} = useQuery({
		queryKey: ['recipe', id],
		queryFn: () => getRecipe(id),
	})

	if (isRecipeLoading) {
		return <div>Loading...</div>
	}

	if (recipeError) {
		return <div>Error: {recipeError.message}</div>
	}

	return (
		<div>
			<article className="flex flex-col gap-2 border-2 rounded-lg p-4 max-w-96 w-96 h-128">
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
					<p className="text-sm text-zinc-500">adicionado em: {format(new Date(recipe.createdAt), 'dd/MM/yyyy')}</p>
					<p className="text-sm text-zinc-500">
						última atualização: {format(new Date(recipe.updatedAt), 'dd/MM/yyyy')}
					</p>
				</footer>
			</article>
		</div>
	)
}
