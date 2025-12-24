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
	perPage?: number
	search?: string
}

export async function getRecipes({ pageIndex }: IGetRecipesParams) {
	const { data } = await api.get<TGetRecipesResponse>('/recipes', {
		params: {
			pageIndex: pageIndex,
		},
	})

	return data
}
