import type { IUser } from '@/@types/auth'
import { api } from '@/lib/axios'

export interface ISignInBody {
	email: string
	password: string
}

export type TSignInResponse = IUser

export async function signIn({ email, password }: ISignInBody) {
	const { data } = await api.post<TSignInResponse>('/auth/sign-in', { email, password })

	return data
}
