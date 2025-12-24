export interface IRecipe {
	id: string
	title: string
	titleNormalized: string
	slug: string
	description: string
	photo: string
	ingredients: string[]
	instructions: string
	userId: string
	createdAt: string
	updatedAt: string
}
