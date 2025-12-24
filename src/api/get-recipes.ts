import type { IRecipe } from '@/@types/recipe'
import { api } from '@/lib/axios'

export interface IGetRecipesResponse {
	recipes: IRecipe[]
	meta: {
		pageIndex: number
		perPage: number
		totalCount: number
	}
}

interface IGetRecipesParams {
	pageIndex: number
	recipeName?: string
}

export async function getRecipes({ pageIndex, recipeName }: IGetRecipesParams) {
	const { data } = await api.get<IGetRecipesResponse>('/recipes', {
		params: {
			pageIndex,
			recipeName,
		},
	})

	return data
}
