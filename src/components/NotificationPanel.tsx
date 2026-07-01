import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bell, X, Check } from 'lucide-react'
import type { Project } from '../lib/types'
import { getExpiryInfo } from '../lib/expiry'

interface NotificationPanelProps {
  projects: Project[]
  acknowledged: Set<string>
}

export function NotificationPanel({ projects, acknowledged }: NotificationPanelProps) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  const notifications = projects
    .filter(p => {
      if (!acknowledged.has(p.id)) return false
      const info = getExpiryInfo(p.bid_validity_date)
      return info.status === 'warning' || info.status === 'expired'
    })
    .sort((a, b) => {
      const aInfo = getExpiryInfo(a.bid_validity_date)
      const bInfo = getExpiryInfo(b.bid_validity_date)
      return aInfo.daysLeft - bInfo.daysLeft
    })

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
      >
        <Bell size={20} className="text-gray-600" />
        {notifications.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border z-50 max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-4 py-2.5 flex items-center justify-between">
              <span className="font-semibold text-sm">{t('notifications')}</span>
              <button onClick={() => setOpen(false)} className="cursor-pointer">
                <X size={16} className="text-gray-400" />
              </button>
            </div>
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-400 text-sm">{t('no_notifications')}</div>
            ) : (
              <div className="divide-y">
                {notifications.map(p => {
                  const info = getExpiryInfo(p.bid_validity_date)
                  const isExpired = info.status === 'expired'
                  return (
                    <div key={p.id} className="px-4 py-3 hover:bg-gray-50">
                      <div className="flex items-start gap-3">
                        <div className={`mt-0.5 w-2 h-2 rounded-full ${isExpired ? 'bg-red-500' : 'bg-amber-400'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{p.project_name || `#${p.serial}`}</p>
                          <p className={`text-xs mt-0.5 ${isExpired ? 'text-red-500' : 'text-amber-500'}`}>
                            {isExpired
                              ? t('expiry_expired')
                              : `${Math.ceil(info.daysLeft)} ${t('expiry_days')}`
                            }
                          </p>
                          {p.bid_validity_date && (
                            <p className="text-xs text-gray-400 mt-0.5">
                              {new Date(p.bid_validity_date).toLocaleDateString('en-CA')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
