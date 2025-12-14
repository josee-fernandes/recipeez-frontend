import { z } from 'zod'

export const envSchema = z.object({
	MODE: z.enum(['development', 'staging', 'production', 'test']).default('development'),
	VITE_API_URL: z.url(),
	VITE_ENABLE_API_DELAY: z.coerce.boolean().default(false),
	VITE_ENABLE_DEVTOOLS: z.coerce.boolean().default(false),
})

const parsedEnv = envSchema.safeParse(import.meta.env)

if (!parsedEnv.success) {
	throw new Error(`Invalid environment variables: ${parsedEnv.error.message}`)
}

export const env = parsedEnv.data
