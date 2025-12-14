import axios from 'axios'
import { env } from '@/env'
import { useAuthStore } from '@/stores/auth'

export const api = axios.create({
	baseURL: env.VITE_API_URL,
})

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().user?.token

	if (token) {
		config.headers.Authorization = `Bearer ${token}`
	}

	return config
})

if (env.VITE_ENABLE_API_DELAY) {
	api.interceptors.request.use(async (config) => {
		await new Promise((resolve) => setTimeout(resolve, Math.random() * 3000))

		return config
	})
}
