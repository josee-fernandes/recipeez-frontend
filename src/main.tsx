import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/global.css'

import { enableMSW } from './api/mocks/index.ts'
import { App } from './app.tsx'

enableMSW().then(() => {
	createRoot(document.getElementById('root') as HTMLElement).render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
})
