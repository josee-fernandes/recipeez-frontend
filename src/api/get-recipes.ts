import type { IUser } from '@/@types/auth'
import type { IRecipe } from '@/@types/recipe'
import { api } from '@/lib/axios'

export type TGetRecipesResponse = {
	recipes: (IRecipe & { user: Omit<IUser, 'token'> })[]
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
	const { data } = await api.get<TGetRecipesResponse>('/recipes', {
		params: {
			pageIndex,
			recipeName,
		},
	})

	return data
}
