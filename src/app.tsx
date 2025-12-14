import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider } from '@tanstack/react-router'
import { useState } from 'react'
import { Toaster } from 'sonner'

import { ThemeProvider } from '@/components/theme-provider'
import { routeTree } from '@/route-tree.gen'

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router
	}
}

export function App() {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						staleTime: 1000 * 60 * 2, // 2 minutes
					},
				},
			}),
	)

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme="dark">
				<RouterProvider router={router} />
				<Toaster richColors closeButton />
			</ThemeProvider>
		</QueryClientProvider>
	)
}
