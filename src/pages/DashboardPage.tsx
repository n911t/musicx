import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useProjects } from '../lib/useProjects'
import { DataTable } from '../components/DataTable'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { NotificationPanel } from '../components/NotificationPanel'
import { ExpiryBanner } from '../components/ExpiryBanner'
import { DarkModeToggle } from '../components/DarkModeToggle'
import { getExpiryInfo } from '../lib/expiry'
import { LogOut, Building2, TrendingUp, Timer, AlertTriangle, CheckCircle2, Search } from 'lucide-react'

export function DashboardPage() {
  const { t } = useTranslation()
  const { projects, loading, error, currentUserId, addRow, updateField, deleteRow } = useProjects()
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')

  const handleAcknowledge = (id: string) => {
    setAcknowledged(prev => new Set(prev).add(id))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  const stats = useMemo(() => {
    const valid = projects.filter(p => p.project_name && p.project_name.trim())
    const expired = valid.filter(p => getExpiryInfo(p.bid_validity_date).status === 'expired').length
    const warning = valid.filter(p => getExpiryInfo(p.bid_validity_date).status === 'warning').length
    const active = valid.length - expired - warning
    return { total: valid.length, active, warning, expired }
  }, [projects])

  return (
    <div className="min-h-screen bg-[#f4f1ec] dark:bg-gray-950 transition-colors">
      <header
        className="sticky top-0 z-40 shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #0F1A2E 0%, #1B2A4A 50%, #2C4C7C 100%)',
        }}
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white leading-tight">{t('app_title')}</h1>
              <p className="text-blue-300 text-xs">{t('app_subtitle')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationPanel projects={projects} acknowledged={acknowledged} />
            <LanguageSwitcher />
            <DarkModeToggle />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/10 transition-all cursor-pointer"
            >
              <LogOut size={16} />
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <Building2 className="text-blue-700 dark:text-blue-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.total}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('filter_all')}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-green-600 dark:text-green-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.active}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('filter_active')}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <Timer className="text-amber-600 dark:text-amber-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.warning}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('filter_expiring')}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.expired}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('filter_expired')}</p>
            </div>
          </div>
        </div>

        <ExpiryBanner
          projects={projects}
          acknowledged={acknowledged}
          onAcknowledge={handleAcknowledge}
        />

        <div className="relative mb-4">
          <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={t('search')}
            className="w-full pr-12 pl-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
          />
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-4 sm:p-6">
          <DataTable
            projects={projects}
            loading={loading}
            error={error}
            currentUserId={currentUserId}
            onAddRow={addRow}
            onUpdateField={updateField}
            onDeleteRow={deleteRow}
            searchQuery={searchQuery}
          />
        </div>
      </main>
    </div>
  )
}
