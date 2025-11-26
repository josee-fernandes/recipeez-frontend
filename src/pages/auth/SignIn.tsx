import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useAuth } from '@/contexts/Auth'
import { api } from '@/lib/axios'

export const SignIn: React.FC = () => {
	const { updateUserToken } = useAuth()
	const navigate = useNavigate()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setEmail(event.target.value)
	}

	const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPassword(event.target.value)
	}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault()

		try {
			const body = {
				email,
				password,
			}

			const { data } = await api.post('/auth/sign-in', body)

			updateUserToken(data.token)
			localStorage.setItem('@recipeez-0.0.1:token', data.token)
			navigate('/recipes')
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div>
			<h1 className="text-2xl font-bold">Sign in</h1>
			<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
				<label className="flex gap-2 items-center">
					E-mail
					<input
						type="email"
						className="border-2 border-gray-300 rounded-md p-2"
						value={email}
						onChange={handleEmailChange}
					/>
				</label>
				<label className="flex gap-2 items-center">
					Senha
					<input
						type="password"
						className="border-2 border-gray-300 rounded-md p-2"
						value={password}
						onChange={handlePasswordChange}
					/>
				</label>
				<button type="submit" className="bg-blue-500 text-white p-2 rounded-lg max-w-72">
					Entrar
				</button>
			</form>
		</div>
	)
}

SignIn.displayName = 'SignIn'
