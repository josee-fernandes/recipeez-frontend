import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { LoaderCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import type { IRecipe } from '@/@types/recipe'
import { createRecipe, type ICreateRecipeResponse } from '@/api/create-recipe'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from './ui/button'

interface ICreateRecipeFormProps {
	onCreate: () => void
}

const createRecipeFormSchema = z.object({
	title: z.string().min(1, { message: 'O título é obrigatório' }),
	description: z.string().min(1, { message: 'A descrição é obrigatória' }),
	photo: z.instanceof(File).optional(),
	ingredients: z.array(z.string()),
	instructions: z.string().min(1, { message: 'As instruções são obrigatórias' }),
})

type CreateRecipeFormValues = z.infer<typeof createRecipeFormSchema>

export const CreateRecipeForm: React.FC<ICreateRecipeFormProps> = ({ onCreate }) => {
	const queryClient = useQueryClient()

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		setError,
		watch,
	} = useForm<CreateRecipeFormValues>({
		resolver: zodResolver(createRecipeFormSchema),
		defaultValues: {
			title: '',
			description: '',
			photo: undefined,
			ingredients: [],
			instructions: '',
		},
	})

	function updateRecipesListCache(newRecipe: ICreateRecipeResponse) {
		const recipesListCache = queryClient.getQueriesData<IRecipe[]>({
			queryKey: ['recipes'],
		})

		for (const [cacheKey, cacheData] of recipesListCache) {
			if (!cacheData) return

			queryClient.setQueryData<IRecipe[]>(cacheKey, [...cacheData, newRecipe])
		}
	}

	const { mutateAsync: createRecipeFn, isPending: isCreatingRecipe } = useMutation({
		mutationFn: createRecipe,
		onSuccess: (data) => {
			updateRecipesListCache(data)
			onCreate()
		},
		onError: () => {
			toast.error('Erro ao criar receita. Tente novamente.')
		},
	})

	const [photoPreview, setPhotoPreview] = useState<string | null>(null)
	const photo = watch('photo')

	async function handleCreateRecipe(data: CreateRecipeFormValues) {
		await createRecipeFn({
			title: data.title,
			description: data.description,
			photo: data?.photo,
			ingredients: data.ingredients,
			instructions: data.instructions,
		})
	}

	useEffect(() => {
		if (photo instanceof File) {
			const reader = new FileReader()
			reader.onloadend = () => {
				setPhotoPreview(reader.result as string)
			}
			reader.readAsDataURL(photo)
		} else {
			setPhotoPreview(null)
		}
	}, [photo])

	return (
		<form onSubmit={handleSubmit(handleCreateRecipe)} className="flex flex-col gap-4">
			<h2 className="text-2xl font-bold">Criar receita</h2>
			{errors.title && (
				<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
					{errors.title.message}
				</div>
			)}

			<label htmlFor="title" className="flex gap-2 items-center">
				Título
			</label>
			<Input id="title" type="text" className="border-2 rounded-md p-2" {...register('title')} />
			<label htmlFor="description" className="flex gap-2 items-center">
				Descrição
			</label>
			<Textarea id="description" className="border-2 rounded-md p-2 min-h-40" rows={4} {...register('description')} />
			<label htmlFor="photo" className="flex gap-2 items-center">
				Foto
			</label>
			<Controller
				control={control}
				name="photo"
				render={({ field: { onChange, value, ...field } }) => (
					<>
						<Input
							id="photo"
							type="file"
							accept="image/*"
							{...field}
							onChange={(event) => {
								const file = event.target.files?.[0]
								if (file) {
									if (!file.type.startsWith('image/')) {
										setError('photo', {
											type: 'manual',
											message: 'Por favor, selecione apenas arquivos de imagem',
										})
										event.target.value = ''
										return
									}

									const maxSize = 5 * 1024 * 1024 // 5MB
									if (file.size > maxSize) {
										setError('photo', {
											type: 'manual',
											message: 'A imagem deve ter no máximo 5MB',
										})
										event.target.value = ''
										return
									}

									onChange(file)
								} else {
									onChange(undefined)
								}
							}}
						/>
						{errors.photo && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2">
								{errors.photo.message}
							</div>
						)}
					</>
				)}
			/>
			{photoPreview && (
				<div className="mt-2">
					<img src={photoPreview} alt="Preview" className="max-w-xs max-h-48 object-cover rounded" />
				</div>
			)}
			<label htmlFor="ingredients" className="flex gap-2 items-center">
				Ingredientes
				<p className="text-sm text-zinc-500">
					(Separar ingrediente por ponto e vírgula. Exemplo: 200 g Farinha de trigo; Leite; Ovos; Açúcar; Sal)
				</p>
			</label>

			<Controller
				control={control}
				name="ingredients"
				render={({ field: { onChange, value, ...field } }) => (
					<>
						<Input
							id="ingredients"
							type="text"
							className="border-2 rounded-md p-2"
							{...field}
							value={value ? value.join('; ') : ''}
							onChange={(event) => {
								const inputValue = event.target.value

								const ingredientsArray = inputValue
									.split(';')
									.map((ingredient) => ingredient.trim())
									.filter((ingredient) => ingredient.length > 0)
								onChange(ingredientsArray)
							}}
						/>
						{errors.ingredients && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-2">
								{errors.ingredients.message}
							</div>
						)}
					</>
				)}
			/>

			<label htmlFor="instructions" className="flex gap-2 items-center">
				Instruções
			</label>
			<Textarea id="instructions" className="border-2 rounded-md p-2 min-h-40" rows={4} {...register('instructions')} />
			<Button type="submit" disabled={isCreatingRecipe}>
				{isCreatingRecipe ? <LoaderCircle className="animate-spin" /> : 'Criar receita'}
			</Button>
		</form>
	)
}

CreateRecipeForm.displayName = 'CreateRecipeForm'
