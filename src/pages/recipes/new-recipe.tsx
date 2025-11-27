import { useNavigate } from 'react-router'

import { CreateRecipeForm } from '@/components/create-recipe-form'

export const NewRecipe: React.FC = () => {
	const navigate = useNavigate()

	const onRecipeCreated = () => {
		navigate('/recipes')
	}

	return (
		<div className="max-w-[1200px] mx-auto py-4">
			<h1>Nova Receita</h1>
			<CreateRecipeForm onCreate={onRecipeCreated} />
		</div>
	)
}

NewRecipe.displayName = 'NewRecipe'
