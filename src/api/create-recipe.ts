import { api } from '@/lib/axios'

interface ICreateRecipeBody {
	title: string
	description: string
	photo?: File
	ingredients: string[]
	instructions: string
}

export interface ICreateRecipePhotoResponse {
	photo: string
}

export interface ICreateRecipeResponse {
	id: string
	title: string
	description: string
	photo: string
	ingredients: string[]
	instructions: string
	createdAt: string
	updatedAt: string
}

export async function createRecipe(body: ICreateRecipeBody) {
	const { data: recipeData } = await api.post<ICreateRecipeResponse>('/recipes', {
		title: body.title,
		description: body.description,
		ingredients: body.ingredients,
		instructions: body.instructions,
	})

	if (body?.photo) {
		const formData = new FormData()
		formData.append('photo', body.photo)

		const { data: photoData } = await api.post<ICreateRecipePhotoResponse>(
			`/recipes/${recipeData.id}/photo`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			},
		)

		return { ...recipeData, ...photoData }
	}

	return recipeData
}
