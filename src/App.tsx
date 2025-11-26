import { createBrowserRouter, type MiddlewareFunction, redirect } from 'react-router'
import { RouterProvider } from 'react-router/dom'

import { AuthContextProvider } from '@/contexts/Auth'
import { api } from '@/lib/axios'
import { SignIn } from '@/pages/auth/SignIn'
import { Recipes } from '@/pages/recipes'

const getToken = () => localStorage.getItem('@recipeez-0.0.1:token')

const authMiddleware: MiddlewareFunction = async (_, next) => {
	const token = getToken()

	if (!token) {
		throw redirect('/auth/sign-in')
	}

	api.defaults.headers.common.Authorization = `Bearer ${token}`
	await next()
}

const indexLoader = async () => {
	const token = getToken()

	if (token) {
		throw redirect('/recipes')
	}

	throw redirect('/auth/sign-in')
}

const signInLoader = async () => {
	const token = getToken()

	if (token) {
		throw redirect('/recipes')
	}

	return null
}

const recipesLoader = async () => {
	const token = getToken()

	if (!token) {
		throw redirect('/auth/sign-in')
	}

	api.defaults.headers.common.Authorization = `Bearer ${token}`
	return { token }
}

const router = createBrowserRouter([
	{
		path: '/',
		children: [
			{
				index: true,
				loader: indexLoader,
			},
			{
				path: '/auth/sign-in',
				element: <SignIn />,
				loader: signInLoader,
			},
			{
				path: '/recipes',
				element: <Recipes />,
				loader: recipesLoader,
				middleware: [authMiddleware],
			},
			{
				path: '*',
				loader: () => redirect('/auth/sign-in'),
			},
		],
	},
])

export const App: React.FC = () => {
	return (
		<AuthContextProvider>
			<RouterProvider router={router} />
		</AuthContextProvider>
	)
}

App.displayName = 'App'
