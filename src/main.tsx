import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@/styles/global.css'

import { App } from './app'

// biome-ignore lint: root will exist
createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
)
