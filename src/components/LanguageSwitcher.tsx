import { useTranslation } from 'react-i18next'

export function LanguageSwitcher() {
  const { i18n } = useTranslation()

  const toggle = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = next
  }

  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 text-sm rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer font-medium"
    >
      {i18n.language === 'ar' ? 'English' : 'العربية'}
    </button>
  )
}
