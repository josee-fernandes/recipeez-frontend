import { api } from '@/lib/axios'

interface IDeleteRecipeBody {
	recipeId: string
}

export async function deleteRecipe({ recipeId }: IDeleteRecipeBody) {
	await api.delete(`/recipes/${recipeId}`)
}
