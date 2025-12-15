import type { IRecipe } from '@/@types/recipe'
import { api } from '@/lib/axios'

export async function getRecipe(id: string) {
	const { data } = await api.get<IRecipe>(`/recipes/${id}`)

	return data
}
