import { useEffect } from 'react'
import { Dashboard } from './pages/Dashboard'
import { useUIStore } from './stores/uiStore'
import { Sun, Moon, LogOut } from 'lucide-react'
import { Button } from './components/ui/Button'

function App() {
  const { isDarkMode, toggleDarkMode, setDarkMode } = useUIStore()

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true)
    }
  }, [setDarkMode])

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">RUBENS <span className="text-blue-600">GRAF</span></span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2" />
            <Button variant="ghost" size="sm" className="gap-2">
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <Dashboard />
      </main>

      <footer className="py-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 text-sm">
        &copy; 2024 Rubens Graf - Gestão Industrial
      </footer>
    </div>
  )
}

export default App
