import tailwindcss from '@tailwindcss/vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import removeConsole from 'vite-plugin-remove-console'

export default defineConfig({
	plugins: [
		...(process.env.NODE_ENV === 'development' ? [devtools()] : []),
		tanstackRouter({
			target: 'react',
			autoCodeSplitting: true,
			generatedRouteTree: './src/route-tree.gen.ts',
			routesDirectory: './src/pages',
			routeToken: 'layout',
		}),
		react(),
		tsconfigPaths(),
		tailwindcss(),
		removeConsole()
	],
	build: {
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (id.includes('react') || id.includes('react-dom')) {
						return 'react-vendor'
					}
					if (
						id.includes('@tanstack/react-query') ||
						id.includes('@tanstack/react-router') ||
						id.includes('@tanstack/react-table')
					) {
						return 'tanstack-vendor'
					}
					if (
						id.includes('@radix-ui/react-alert-dialog') ||
						id.includes('@radix-ui/react-avatar') ||
						id.includes('@radix-ui/react-dropdown-menu') ||
						id.includes('@radix-ui/react-separator') ||
						id.includes('@radix-ui/react-slot') ||
						id.includes('@radix-ui/react-switch')
					) {
						return 'ui-vendor'
					}
					if (
						id.includes('axios') ||
						id.includes('zod') ||
						id.includes('date-fns') ||
						id.includes('lucide-react')
					) {
						return 'utils-vendor'
					}
				},
			},
		},
	},
})
