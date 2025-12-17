import { api } from '@/lib/axios'

interface IUpdateRecipePhotoBody {
	recipeId: string
	photo: File
}

export interface IUpdateRecipePhotoResponse {
	photo: string
}

export async function updateRecipePhoto(body: IUpdateRecipePhotoBody) {
	const formData = new FormData()
	formData.append('photo', body.photo)

	const { data } = await api.put<IUpdateRecipePhotoResponse>(`/recipes/${body.recipeId}/photo`, formData, {
		headers: {
			'Content-Type': 'multipart/form-data',
		},
	})

	return { id: body.recipeId, ...data }
}
