import { useTranslation } from 'react-i18next'
import { AlertTriangle, X, CalendarClock } from 'lucide-react'
import type { Project } from '../lib/types'
import { getExpiryInfo } from '../lib/expiry'

interface ExpiryBannerProps {
  projects: Project[]
  acknowledged: Set<string>
  onAcknowledge: (id: string) => void
}

export function ExpiryBanner({ projects, acknowledged, onAcknowledge }: ExpiryBannerProps) {
  const { t } = useTranslation()

  const expiring = projects.filter(p => {
    if (acknowledged.has(p.id)) return false
    const info = getExpiryInfo(p.bid_validity_date)
    return info.status === 'warning' || info.status === 'expired'
  })

  if (expiring.length === 0) return null

  return (
    <div className="mb-6 space-y-2">
      {expiring.map(p => {
        const info = getExpiryInfo(p.bid_validity_date)
        const isExpired = info.status === 'expired'
        return (
          <div
            key={p.id}
            className={`flex items-center justify-between px-5 py-3.5 rounded-xl shadow-sm ${
              isExpired
                ? 'bg-gradient-to-r from-red-50 to-red-50/50 border border-red-200'
                : 'bg-gradient-to-r from-amber-50 to-amber-50/50 border border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isExpired ? 'bg-red-100' : 'bg-amber-100'
              }`}>
                {isExpired
                  ? <AlertTriangle size={18} className="text-red-500" />
                  : <CalendarClock size={18} className="text-amber-500" />
                }
              </div>
              <div>
                <span className={`font-semibold text-sm ${isExpired ? 'text-red-700' : 'text-amber-700'}`}>
                  {p.project_name || `#${p.serial}`}
                </span>
                <span className={`text-xs mr-2 ${isExpired ? 'text-red-500' : 'text-amber-500'}`}>
                  {isExpired
                    ? t('expiry_expired')
                    : `${t('expiry_remaining')} ${Math.ceil(info.daysLeft)} ${t('expiry_days')}`
                  }
                </span>
              </div>
            </div>
            <button
              onClick={() => onAcknowledge(p.id)}
              className="flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-xl bg-white border shadow-sm hover:bg-gray-50 text-gray-600 font-medium transition-all cursor-pointer"
            >
              <X size={14} />
              {t('expiry_ok')}
            </button>
          </div>
        )
      })}
    </div>
  )
}
