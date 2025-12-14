import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { IUser } from '@/@types/auth'

interface IAuthState {
	user: IUser | null
	isAuthenticated: boolean
	setMemoryUser: (user: IUser) => void
	clearMemoryUser: () => void
}

export const useAuthStore = create<IAuthState>()(
	persist(
		(set) => ({
			user: null,
			isAuthenticated: false,
			setMemoryUser: (user) => set({ user, isAuthenticated: true }),
			clearMemoryUser: () => set({ user: null, isAuthenticated: false }),
		}),
		{
			name: '@recipeez:auth',
		},
	),
)
