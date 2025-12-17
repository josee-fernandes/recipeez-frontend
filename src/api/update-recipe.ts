import { api } from '@/lib/axios'

interface IUpdateRecipeBody {
	recipeId: string
	title: string
	description: string
	ingredients: string[]
	instructions: string
}

export interface IUpdateRecipeResponse {
	title: string
	description: string
	ingredients: string[]
	instructions: string
}

export async function updateRecipe(body: IUpdateRecipeBody) {
	const { data } = await api.put<IUpdateRecipeResponse>(`/recipes/${body.recipeId}`, {
		title: body.title,
		description: body.description,
		ingredients: body.ingredients,
		instructions: body.instructions,
	})

	return { id: body.recipeId, ...data }
}
