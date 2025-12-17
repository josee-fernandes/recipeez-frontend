import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'

import { useAuthStore } from '@/stores/auth'

export const Route = createFileRoute('/_auth')({
	component: AuthLayout,
})

function AuthLayout() {
	const { isAuthenticated } = useAuthStore()

	if (isAuthenticated) {
		return <Navigate to="/recipes" />
	}

	return <Outlet />
}
