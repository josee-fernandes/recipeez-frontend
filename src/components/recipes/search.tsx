import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import z from 'zod'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

const recipeSearchFormSchema = z.object({
	recipeName: z.string().optional(),
})

type IRecipeSearchFormValues = z.infer<typeof recipeSearchFormSchema>

export function RecipesSearch() {
	const navigate = useNavigate()
	const { recipeName = '' } = useSearch({ from: '/_app/recipes/' })
	const { register, handleSubmit } = useForm<IRecipeSearchFormValues>({
		resolver: zodResolver(recipeSearchFormSchema),
		defaultValues: {
			recipeName: recipeName,
		},
	})

	async function handleSearch(data: IRecipeSearchFormValues) {
		if (data.recipeName === '') {
			navigate({ to: '/recipes', search: (oldSearch) => ({ ...oldSearch, recipeName: undefined }) })
			return
		}

		navigate({ to: '/recipes', search: (oldSearch) => ({ ...oldSearch, recipeName: data.recipeName }) })
	}

	return (
		<form className="flex gap-2" onSubmit={handleSubmit(handleSearch)}>
			<Input type="text" placeholder="Pesquisar receita" {...register('recipeName')} />
			<Button type="submit">Pesquisar</Button>
		</form>
	)
}
