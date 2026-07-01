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
      className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer"
    >
      {i18n.language === 'ar' ? 'English' : 'العربية'}
    </button>
  )
}
