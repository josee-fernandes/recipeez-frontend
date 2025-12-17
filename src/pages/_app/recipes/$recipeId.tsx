import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ArrowLeft, CheckIcon, Image, Loader2, PencilIcon, PencilOffIcon, TrashIcon } from 'lucide-react'
import { useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import type { IRecipe } from '@/@types/recipe'
import { deleteRecipe } from '@/api/delete-recipe'
import { getRecipe } from '@/api/get-recipe'
import { type IUpdateRecipeResponse, updateRecipe } from '@/api/update-recipe'
import { type IUpdateRecipePhotoResponse, updateRecipePhoto } from '@/api/update-recipe-photo'
import { RecipeSkeleton } from '@/components/recipe-skeleton'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export const Route = createFileRoute('/_app/recipes/$recipeId')({
	component: RouteComponent,
})

const recipeEditFormSchema = z.object({
	title: z.string().min(1, { message: 'O título é obrigatório' }),
	description: z.string().min(1, { message: 'A descrição é obrigatória' }),
	ingredients: z.array(z.string()).min(1, { message: 'Os ingredientes são obrigatórios' }),
	instructions: z.string().min(1, { message: 'As instruções são obrigatórias' }),
})

type TRecipeEditFormValues = z.infer<typeof recipeEditFormSchema>

function RouteComponent() {
	const { recipeId } = Route.useParams()
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const {
		data: recipe,
		isPending: isRecipeLoading,
		error: recipeError,
	} = useQuery({
		queryKey: ['recipe', recipeId],
		queryFn: () => getRecipe(recipeId),
	})

	const { register, handleSubmit, control } = useForm<TRecipeEditFormValues>({
		resolver: zodResolver(recipeEditFormSchema),
		values: {
			title: recipe?.title ?? '',
			description: recipe?.description ?? '',
			ingredients: recipe?.ingredients ?? [],
			instructions: recipe?.instructions ?? '',
		},
	})

	function updateRecipeCache(
		recipeId: string,
		updatedRecipe: (IUpdateRecipeResponse | IUpdateRecipePhotoResponse) & { id: string },
	) {
		const recipeCache = queryClient.getQueriesData<IRecipe>({
			queryKey: ['recipe', recipeId],
		})

		if (!recipeCache) return

		for (const [cacheKey, cacheData] of recipeCache) {
			if (!cacheData) continue

			queryClient.setQueryData<IRecipe>(cacheKey, {
				...cacheData,
				...updatedRecipe,
			})
		}
	}

	function updateRecipesListCache(
		recipeId: string,
		updatedRecipe?: (IUpdateRecipeResponse | IUpdateRecipePhotoResponse) & { id: string },
	) {
		const recipesListCache = queryClient.getQueriesData<IRecipe[]>({
			queryKey: ['recipes'],
		})

		for (const [cacheKey, cacheData] of recipesListCache) {
			if (!cacheData) return

			if (updatedRecipe) {
				queryClient.setQueryData<IRecipe[]>(
					cacheKey,
					cacheData.map((recipe) => (recipe.id === updatedRecipe.id ? { ...recipe, ...updatedRecipe } : recipe)),
				)
			} else {
				queryClient.setQueryData<IRecipe[]>(
					cacheKey,
					cacheData.filter((recipe) => recipe.id !== recipeId),
				)
			}
		}
	}

	const { mutateAsync: deleteRecipeFn, isPending: isDeletingRecipe } = useMutation({
		mutationFn: deleteRecipe,
		onSuccess(_, { recipeId }) {
			toast.success('Receita deletada com sucesso')

			updateRecipesListCache(recipeId)
			navigate({ to: '/recipes', replace: true })
		},
		onError: () => {
			toast.error('Erro ao deletar receita')
		},
	})

	const { mutateAsync: updateRecipeFn, isPending: isUpdatingRecipe } = useMutation({
		mutationFn: updateRecipe,
		onSuccess: (data, { recipeId }) => {
			updateRecipeCache(recipeId, data)
			updateRecipesListCache(recipeId, data)
			toast.success('Receita atualizada com sucesso')
			setIsEditing(false)
		},
		onError: () => {
			toast.error('Erro ao atualizar receita')
		},
	})

	const { mutateAsync: updateRecipePhotoFn, isPending: isUpdatingRecipePhoto } = useMutation({
		mutationFn: updateRecipePhoto,
		onSuccess: (data, { recipeId }) => {
			toast.success('Foto da receita atualizada com sucesso')
			updateRecipeCache(recipeId, data)
			updateRecipesListCache(recipeId, data)
			setIsEditing(false)
		},
		onError: () => {
			toast.error('Erro ao atualizar foto da receita')
		},
	})

	const [isEditing, setIsEditing] = useState(false)

	async function handleDeleteRecipe(id: string) {
		await deleteRecipeFn({ recipeId: id })
	}

	async function handleUpdateRecipe(data: TRecipeEditFormValues) {
		await updateRecipeFn({ recipeId, ...data })
	}

	async function handleUpdateRecipePhoto(photo: File) {
		await updateRecipePhotoFn({ recipeId, photo })
	}

	async function handlePhotoFileChange(event: React.ChangeEvent<HTMLInputElement>) {
		const file = event.target.files?.[0]
		if (!file) return

		// Validar tipo de arquivo
		if (!file.type.startsWith('image/')) {
			toast.error('Por favor, selecione apenas arquivos de imagem')
			event.target.value = ''
			return
		}

		// Validar tamanho (5MB)
		const maxSize = 5 * 1024 * 1024
		if (file.size > maxSize) {
			toast.error('A imagem deve ter no máximo 5MB')
			event.target.value = ''
			return
		}

		await handleUpdateRecipePhoto(file)

		event.target.value = ''
	}

	if (recipeError) {
		return <div>Error: {recipeError.message}</div>
	}

	return (
		<div className="max-w-[1200px] mx-auto py-4">
			<Button type="button" variant="outline" size="icon" onClick={() => navigate({ to: '/recipes' })}>
				<ArrowLeft className="w-4 h-4" />
			</Button>
			<div className="mt-6">
				{isRecipeLoading && <RecipeSkeleton />}
				{recipe && (
					<form onSubmit={handleSubmit(handleUpdateRecipe)}>
						<article className="flex flex-col gap-2 border-2 rounded-lg p-4 max-w-96 w-96 min-h-128">
							<header className="flex flex-col gap-2">
								<div className="flex gap-2 mt-6 justify-end">
									{isEditing && (
										<Button type="submit" disabled={isUpdatingRecipe}>
											{isUpdatingRecipe ? (
												<Loader2 className="w-4 h-4 animate-spin" />
											) : (
												<CheckIcon className="w-4 h-4" />
											)}
										</Button>
									)}
									<Button
										type="button"
										variant="outline"
										size="icon"
										disabled={isDeletingRecipe}
										onClick={() => setIsEditing((oldIsEditing) => !oldIsEditing)}
									>
										{isEditing ? <PencilOffIcon className="w-4 h-4" /> : <PencilIcon className="w-4 h-4" />}
									</Button>
									<Button
										type="button"
										variant="destructive"
										size="icon"
										disabled={isDeletingRecipe}
										onClick={() => handleDeleteRecipe(recipeId)}
									>
										{isDeletingRecipe ? (
											<Loader2 className="w-4 h-4 animate-spin" />
										) : (
											<TrashIcon className="w-4 h-4" />
										)}
									</Button>
								</div>
								<Button
									type="button"
									variant="ghost"
									className="w-full h-max p-0 hover:opacity-50"
									onClick={() => fileInputRef.current?.click()}
									disabled={isUpdatingRecipePhoto}
								>
									{isUpdatingRecipePhoto ? (
										<div className="w-full h-40 flex items-center justify-center">
											<Loader2 className="w-6 h-6 animate-spin" />
										</div>
									) : (
										<>
											{recipe.photo ? (
												<img src={recipe.photo} alt={recipe.title} className="w-full h-40 object-cover rounded-lg" />
											) : (
												<div className="w-full h-40 flex items-center justify-center border rounded-lg bg-card">
													<Image className="size-10" />
												</div>
											)}
										</>
									)}
									<input
										ref={fileInputRef}
										type="file"
										accept="image/*"
										className="hidden"
										onChange={handlePhotoFileChange}
									/>
								</Button>
								{isEditing ? (
									<>
										<Input type="text" {...register('title')} />
										<Textarea rows={4} {...register('description')} />
									</>
								) : (
									<>
										<h3 className="text-2xl font-bold">{recipe.title}</h3>
										<p className="text-sm text-muted-foreground text-left wrap-break-word">{recipe.description}</p>
									</>
								)}
							</header>
							<section className="flex flex-col gap-4">
								<div>
									<h4 className="text-lg font-bold">Ingredientes</h4>
									{isEditing ? (
										<Controller
											control={control}
											name="ingredients"
											render={({ field: { onChange, value, ...field } }) => (
												<Input
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
											)}
										/>
									) : (
										<ul>
											{recipe.ingredients.map((ingredient) => (
												<li key={`${recipe.id}-${ingredient}`}>{ingredient}</li>
											))}
										</ul>
									)}
								</div>

								<div>
									<h4 className="text-lg font-bold">Modo de preparo</h4>
									{isEditing ? (
										<Textarea rows={4} {...register('instructions')} />
									) : (
										<p className="text-base">{recipe.instructions}</p>
									)}
								</div>
							</section>
							<footer>
								<p className="text-sm text-muted-foreground">
									adicionado em: {format(new Date(recipe.createdAt), 'dd/MM/yyyy')}
								</p>
								<p className="text-sm text-muted-foreground">
									última atualização: {format(new Date(recipe.updatedAt), 'dd/MM/yyyy')}
								</p>
							</footer>
						</article>
					</form>
				)}
			</div>
		</div>
	)
}
