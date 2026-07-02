import { useTheme } from '../context/ThemeContext'
import { Sun, Moon } from 'lucide-react'

export function DarkModeToggle() {
  const { isDark, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer"
      title={isDark ? 'وضع النهار' : 'وضع الليل'}
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  )
}
