import { api } from '@/lib/axios'

interface ICreateRecipeBody {
	title: string
	description: string
	photo?: File
	ingredients: string[]
	instructions: string
}

export async function createRecipe(body: ICreateRecipeBody) {
	const { data: recipeData } = await api.post('/recipes', {
		title: body.title,
		description: body.description,
		ingredients: body.ingredients,
		instructions: body.instructions,
	})

	if (body?.photo) {
		const formData = new FormData()
		formData.append('photo', body.photo)

		await api.post(`/recipes/${recipeData.id}/photo`, formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		})
	}

	return recipeData
}
