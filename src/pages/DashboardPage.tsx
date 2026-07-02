import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { supabase } from '../lib/supabase'
import { useProjects } from '../lib/useProjects'
import { DataTable } from '../components/DataTable'
import { LanguageSwitcher } from '../components/LanguageSwitcher'
import { NotificationPanel } from '../components/NotificationPanel'
import { ExpiryBanner } from '../components/ExpiryBanner'
import { getExpiryInfo } from '../lib/expiry'
import { LogOut, Building2, TrendingUp, Timer, AlertTriangle, CheckCircle2 } from 'lucide-react'

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

  const stats = useMemo(() => {
    const valid = projects.filter(p => p.project_name && p.project_name.trim())
    const expired = valid.filter(p => getExpiryInfo(p.bid_validity_date).status === 'expired').length
    const warning = valid.filter(p => getExpiryInfo(p.bid_validity_date).status === 'warning').length
    const active = valid.length - expired - warning
    return { total: valid.length, active, warning, expired }
  }, [projects])

  return (
    <div className="min-h-screen" style={{ background: '#f4f1ec' }}>
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
              <p className="text-blue-300 text-xs">Real Estate Management</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NotificationPanel projects={projects} acknowledged={acknowledged} />
            <LanguageSwitcher />
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
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Building2 className="text-blue-700" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              <p className="text-xs text-gray-500">إجمالي المشاريع</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats.active}</p>
              <p className="text-xs text-gray-500">سارية المفعول</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
              <Timer className="text-amber-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{stats.warning}</p>
              <p className="text-xs text-gray-500">تنتهي قريبًا</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              <p className="text-xs text-gray-500">منتهية</p>
            </div>
          </div>
        </div>

        <ExpiryBanner
          projects={projects}
          acknowledged={acknowledged}
          onAcknowledge={handleAcknowledge}
        />

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <DataTable
            projects={projects}
            loading={loading}
            error={error}
            onAddRow={addRow}
            onUpdateField={updateField}
          />
        </div>
      </main>
    </div>
  )
}
