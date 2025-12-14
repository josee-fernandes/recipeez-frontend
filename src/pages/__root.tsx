import { createRootRoute, HeadContent, Outlet } from '@tanstack/react-router'
import { lazy, Suspense } from 'react'

const TanStackRouterDevtools =
	import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEVTOOLS === 'true'
		? lazy(() => import('@tanstack/react-router-devtools').then((mod) => ({ default: mod.TanStackRouterDevtools })))
		: () => null
const ReactQueryDevtools =
	import.meta.env.DEV && import.meta.env.VITE_ENABLE_DEVTOOLS === 'true'
		? lazy(() => import('@tanstack/react-query-devtools').then((mod) => ({ default: mod.ReactQueryDevtools })))
		: () => null

export const Route = createRootRoute({
	component: RootComponent,
})

function RootComponent() {
	return (
		<>
			<HeadContent />
			<Outlet />
			{import.meta.env.DEV && (
				<Suspense fallback={null}>
					{TanStackRouterDevtools && <TanStackRouterDevtools />}
					{ReactQueryDevtools && <ReactQueryDevtools />}
				</Suspense>
			)}
		</>
	)
}
