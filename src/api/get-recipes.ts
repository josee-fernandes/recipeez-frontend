import type { IRecipe } from '@/@types/recipe'
import { api } from '@/lib/axios'

export type TGetRecipesResponse = IRecipe[]

export async function getRecipes() {
	const { data } = await api.get<IRecipe[]>('/recipes')

	return data
}
