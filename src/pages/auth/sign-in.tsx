import { useState } from 'react'
import { useNavigate } from 'react-router'

import { useAuth } from '@/contexts/auth'
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
		<div className="max-w-[1200px] mx-auto py-4 w-full h-screen flex flex-col items-center justify-center">
			<div className="border-2 border-zinc-200 flex flex-col gap-4 p-8 rounded-lg shadow-2xl">
				<h1 className="text-2xl font-bold text-center">Recipeez</h1>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<div>
						<label htmlFor="email" className="text-base">
							E-mail
						</label>
						<input
							id="email"
							type="email"
							className="border-2 border-gray-300 rounded-md p-2 max-w-72 w-full"
							value={email}
							onChange={handleEmailChange}
						/>
					</div>
					<div>
						<label htmlFor="password" className="text-base">
							Senha
						</label>
						<input
							id="password"
							type="password"
							className="border-2 border-gray-300 rounded-md p-2 max-w-72 w-full"
							value={password}
							onChange={handlePasswordChange}
						/>
					</div>
					<button
						type="submit"
						className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg max-w-72 transition-all cursor-pointer"
					>
						Entrar
					</button>
				</form>
			</div>
		</div>
	)
}

SignIn.displayName = 'SignIn'
