import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useProjects } from '../lib/useProjects'
import { DataTable } from '../components/DataTable'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { NotificationPanel } from '../components/NotificationPanel'
import { ExpiryBanner } from '../components/ExpiryBanner'
import { LogOut, Building2 } from 'lucide-react'

export function DashboardPage() {
  const { t } = useTranslation()
  const { projects, loading, error, addRow, updateField } = useProjects()
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set())

  const handleAcknowledge = (id: string) => {
    setAcknowledged(prev => new Set(prev).add(id))
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-full mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="text-blue-600" size={24} />
            <h1 className="text-lg font-bold text-gray-800">{t('app_title')}</h1>
          </div>
          <div className="flex items-center gap-3">
            <NotificationPanel projects={projects} acknowledged={acknowledged} />
            <LanguageSwitcher />
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-600 cursor-pointer"
            >
              <LogOut size={16} />
              {t('logout')}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-full mx-auto px-4 py-6">
        <ExpiryBanner
          projects={projects}
          acknowledged={acknowledged}
          onAcknowledge={handleAcknowledge}
        />
        <DataTable
          projects={projects}
          loading={loading}
          error={error}
          onAddRow={addRow}
          onUpdateField={updateField}
        />
      </main>
    </div>
  )
}
