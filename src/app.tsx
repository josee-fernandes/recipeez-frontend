import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { BrowserRouter, Navigate, Outlet, Route, Routes } from 'react-router'
import { ThemeProvider } from '@/components/theme-provider'
import { AuthContextProvider } from '@/contexts/auth'
import { api } from '@/lib/axios'
import { SignIn } from '@/pages/auth/sign-in'
import { Recipes } from '@/pages/recipes'
import { NewRecipe } from '@/pages/recipes/new-recipe'
import { GlobalTemplate } from '@/templates/global-template'

const getToken = () => localStorage.getItem('@recipeez-0.0.1:token')

// Componente de proteção de rota autenticada
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const token = getToken()

	// Configura o header de forma síncrona antes de renderizar
	if (token) {
		api.defaults.headers.common.Authorization = `Bearer ${token}`
	}

	if (!token) {
		return <Navigate to="/auth/sign-in" replace />
	}

	return <>{children}</>
}

// Componente para redirecionar usuários autenticados
const RedirectIfAuthenticated: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const token = getToken()

	if (token) {
		return <Navigate to="/recipes" replace />
	}

	return <>{children}</>
}

// Layout para rotas de receitas (com Outlet para rotas filhas)
const RecipesLayout: React.FC = () => {
	const token = getToken()

	// Garante que o token está configurado antes de renderizar
	useEffect(() => {
		if (token) {
			api.defaults.headers.common.Authorization = `Bearer ${token}`
		}
	}, [token])

	return (
		<ProtectedRoute>
			<Outlet />
		</ProtectedRoute>
	)
}

// Componente para a rota raiz
const IndexRoute: React.FC = () => {
	const token = getToken()

	if (token) {
		return <Navigate to="/recipes" replace />
	}

	return <Navigate to="/auth/sign-in" replace />
}

export const App: React.FC = () => {
	const queryClient = new QueryClient()

	return (
		<AuthContextProvider>
			<QueryClientProvider client={queryClient}>
				<ThemeProvider>
					<BrowserRouter>
						<Routes>
							<Route index element={<IndexRoute />} />
							<Route
								path="/auth/sign-in"
								element={
									<RedirectIfAuthenticated>
										<SignIn />
									</RedirectIfAuthenticated>
								}
							/>
							<Route element={<GlobalTemplate />}>
								<Route path="/recipes" element={<RecipesLayout />}>
									<Route index element={<Recipes />} />
									<Route path="new" element={<NewRecipe />} />
								</Route>
							</Route>
							<Route path="*" element={<Navigate to="/auth/sign-in" replace />} />
						</Routes>
					</BrowserRouter>
				</ThemeProvider>
			</QueryClientProvider>
		</AuthContextProvider>
	)
}

App.displayName = 'App'
