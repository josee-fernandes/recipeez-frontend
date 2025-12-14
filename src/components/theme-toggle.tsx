import { Moon, Sun } from 'lucide-react'
import { useTheme } from '@/components/theme-provider'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()

	return (
		<Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
			{theme === 'dark' ? (
				<Moon className="h-[1.2rem] w-[1.2rem] scale-0 -rotate-90 transition-all dark:scale-100 dark:rotate-0" />
			) : (
				<Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:-rotate-90 dark:scale-0" />
			)}
			<span className="sr-only">Toggle theme</span>
		</Button>
	)
}
