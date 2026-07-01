import { useMemo } from 'react'
import { getExpiryInfo } from '../lib/expiry'

interface ExpiryCellProps {
  dateStr: string | null
}

export function ExpiryCell({ dateStr }: ExpiryCellProps) {
  const info = useMemo(() => getExpiryInfo(dateStr), [dateStr])

  if (!dateStr) return <span className="text-gray-400">--</span>

  const formatted = new Date(dateStr).toLocaleDateString('en-CA')

  if (info.status === 'normal') {
    return <span>{formatted}</span>
  }

  if (info.status === 'expired') {
    return (
      <div className="relative w-full h-7 rounded overflow-hidden bg-red-100">
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-red-700 z-10">
          {formatted}
        </span>
      </div>
    )
  }

  const fillPct = (1 - info.progress) * 100

  const r = Math.round(255)
  const g = Math.round(255 - info.progress * 200)
  const b = Math.round(0)

  return (
    <div className="relative w-full h-7 rounded overflow-hidden bg-red-100">
      <div
        className="absolute inset-y-0 left-0 transition-all duration-1000"
        style={{
          width: `${fillPct}%`,
          backgroundColor: `rgba(${r}, ${g}, ${b}, 0.55)`,
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium z-10">
        {formatted}
      </span>
    </div>
  )
}
