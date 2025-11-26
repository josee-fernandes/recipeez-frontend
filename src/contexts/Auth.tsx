import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

interface IAuthContext {
	userToken: string | null
	updateUserToken: (newToken: string | null) => void
}

export const AuthContext = createContext({} as IAuthContext)

interface IAuthContextProviderProps {
	children: React.ReactNode
}

export const AuthContextProvider: React.FC<IAuthContextProviderProps> = ({ children }) => {
	const [userToken, setUserToken] = useState<string | null>(null)

	const updateUserToken = useCallback(
		(newToken: string | null) => {
			if (userToken !== newToken) {
				setUserToken(newToken)
			}

			if (newToken) {
				localStorage.setItem('@recipeez-0.0.1:token', newToken)
			} else {
				localStorage.removeItem('@recipeez-0.0.1:token')
			}
		},
		[userToken],
	)

	const contextValues = useMemo(() => ({ userToken, updateUserToken }), [userToken, updateUserToken])

	useEffect(() => {
		const token = localStorage.getItem('@recipeez-0.0.1:token')

		if (token) {
			setUserToken(token)
		}
	}, [])

	return <AuthContext.Provider value={contextValues}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('useAuth must be used within an AuthContextProvider')
	}

	return context
}
