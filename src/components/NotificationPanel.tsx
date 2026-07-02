import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Bell, X } from 'lucide-react'
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
        className="relative p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
      >
        <Bell size={20} className="text-white" />
        {notifications.length > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-amber-400 text-[10px] font-bold rounded-full flex items-center justify-center text-amber-900 shadow-sm">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b dark:border-gray-700 rounded-t-2xl px-4 py-3 flex items-center justify-between">
              <span className="font-bold text-sm text-gray-800 dark:text-gray-200">{t('notifications')}</span>
              <button onClick={() => setOpen(false)} className="cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X size={16} className="text-gray-400 dark:text-gray-500" />
              </button>
            </div>
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400 dark:text-gray-500 text-sm">{t('no_notifications')}</div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {notifications.map(p => {
                  const info = getExpiryInfo(p.bid_validity_date)
                  const isExpired = info.status === 'expired'
                  return (
                    <div key={p.id} className="px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                          isExpired ? 'bg-red-500' : 'bg-amber-400'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">
                            {p.project_name || `#${p.serial}`}
                          </p>
                          <p className={`text-xs mt-0.5 font-medium ${
                            isExpired ? 'text-red-500 dark:text-red-400' : 'text-amber-500 dark:text-amber-400'
                          }`}>
                            {isExpired
                              ? t('expiry_expired')
                              : `${Math.ceil(info.daysLeft)} ${t('expiry_days')}`
                            }
                          </p>
                          {p.bid_validity_date && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
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
