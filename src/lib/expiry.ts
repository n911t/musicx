export interface ExpiryInfo {
  status: 'normal' | 'warning' | 'expired'
  progress: number
  daysLeft: number
}

export function getExpiryInfo(dateStr: string | null): ExpiryInfo {
  if (!dateStr) return { status: 'normal', progress: 0, daysLeft: Infinity }

  const expiry = new Date(dateStr)
  const now = new Date()
  const diffMs = expiry.getTime() - now.getTime()
  const daysLeft = diffMs / (1000 * 60 * 60 * 24)

  if (daysLeft <= 0) return { status: 'expired', progress: 1, daysLeft: 0 }
  if (daysLeft <= 3) {
    const progress = 1 - daysLeft / 3
    return { status: 'warning', progress, daysLeft }
  }
  return { status: 'normal', progress: 0, daysLeft }
}
