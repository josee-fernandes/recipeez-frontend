import { createFileRoute, useNavigate } from '@tanstack/react-router'

import { CreateRecipeForm } from '@/components/create-recipe-form'
export const Route = createFileRoute('/_app/recipes/new')({
	component: RouteComponent,
})

function RouteComponent() {
	const navigate = useNavigate()

	const onRecipeCreated = () => {
		navigate({ to: '/recipes' })
	}

	return (
		<div className="max-w-[1200px] mx-auto p-4">
			<CreateRecipeForm onCreate={onRecipeCreated} />
		</div>
	)
}
