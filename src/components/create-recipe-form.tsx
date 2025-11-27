import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'

import { api } from '@/lib/axios'

interface ICreateRecipeFormProps {
	onCreate: () => void
}

export const CreateRecipeForm: React.FC<ICreateRecipeFormProps> = ({ onCreate }) => {
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [photo, setPhoto] = useState<File | null>(null)
	const [photoPreview, setPhotoPreview] = useState<string | null>(null)
	const [ingredients, setIngredients] = useState<string[]>([])
	const [instructions, setInstructions] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		setError(null)
		setIsSubmitting(true)

		try {
			if (!title.trim()) {
				setError('O título é obrigatório')
				setIsSubmitting(false)
				return
			}

			if (!photo) {
				setError('Por favor, selecione uma foto')
				setIsSubmitting(false)
				return
			}

			const body = {
				title,
				description,
				ingredients,
				instructions,
			}

			const { data: recipeData } = await api.post('/recipes', body)

			const formData = new FormData()
			formData.append('photo', photo)

			await api.post(`/recipes/${recipeData.id}/photo`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			setTitle('')
			setDescription('')
			setPhoto(null)
			setPhotoPreview(null)
			setIngredients([])
			setInstructions('')

			const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement

			if (fileInput) {
				fileInput.value = ''
			}

			onCreate()
		} catch (error) {
			console.error(error)
			setError('Erro ao criar receita. Tente novamente.')
		} finally {
			setIsSubmitting(false)
		}
	}

	const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setTitle(event.target.value)
	}

	const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setDescription(event.target.value)
	}

	const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]

		if (file) {
			if (!file.type.startsWith('image/')) {
				setError('Por favor, selecione apenas arquivos de imagem')
				event.target.value = ''
				return
			}

			const maxSize = 5 * 1024 * 1024 // 5MB
			if (file.size > maxSize) {
				setError('A imagem deve ter no máximo 5MB')
				event.target.value = ''
				return
			}

			setPhoto(file)
			setError(null)

			const reader = new FileReader()

			reader.onloadend = () => {
				setPhotoPreview(reader.result as string)
			}

			reader.readAsDataURL(file)
		} else {
			setPhoto(null)
			setPhotoPreview(null)
		}
	}

	const handleIngredientsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setIngredients(event.target.value.split(';'))
	}

	const handleInstructionsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setInstructions(event.target.value)
	}

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-4">
			<h2 className="text-2xl font-bold">Criar receita</h2>
			{error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

			<label className="flex gap-2 items-center">
				Título
				<input
					type="text"
					className="border-2 border-gray-300 rounded-md p-2"
					value={title}
					onChange={handleTitleChange}
				/>
			</label>
			<label className="flex gap-2 items-center">
				Descrição
				<textarea
					className="border-2 border-gray-300 rounded-md p-2"
					value={description}
					rows={4}
					onChange={handleDescriptionChange}
				/>
			</label>
			<label className="flex gap-2 items-center">
				Foto
				<input
					type="file"
					className="border-2 border-gray-300 rounded-md p-2"
					accept="image/*"
					onChange={handlePhotoChange}
				/>
				{photoPreview && (
					<div className="mt-2">
						<img src={photoPreview} alt="Preview" className="max-w-xs max-h-48 object-cover rounded" />
					</div>
				)}
			</label>
			<label className="flex gap-2 items-center">
				Ingredientes
				<input
					type="text"
					className="border-2 border-gray-300 rounded-md p-2"
					value={ingredients.join(';')}
					onChange={handleIngredientsChange}
				/>
			</label>
			<label className="flex gap-2 items-center">
				Instruções
				<input
					type="text"
					className="border-2 border-gray-300 rounded-md p-2"
					value={instructions}
					onChange={handleInstructionsChange}
				/>
			</label>
			<button
				type="submit"
				className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg max-w-72 transition-all cursor-pointer"
				disabled={isSubmitting}
			>
				{isSubmitting ? <LoaderCircle className="animate-spin" /> : 'Criar receita'}
			</button>
		</form>
	)
}

CreateRecipeForm.displayName = 'CreateRecipeForm'
