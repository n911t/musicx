import { jsPDF } from 'jspdf'
import { FileDown } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useTheme } from '../context/ThemeContext'
import type { Project } from '../lib/types'

interface Props {
  project: Project
  userName: string
}

export function PdfExportButton({ project, userName }: Props) {
  const { t } = useTranslation()
  const { isDark } = useTheme()

  const exportPdf = () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    const pageW = 190
    let y = 20

    const logo = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="40" height="40">
        <rect width="40" height="40" rx="8" fill="url(#g)"/>
        <defs><linearGradient id="g" x1="0" y1="0" x2="40" y2="40"><stop offset="0%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs>
        <text x="20" y="28" text-anchor="middle" font-size="22" fill="white" font-family="Arial">🏗</text>
      </svg>`

    doc.setFont('helvetica')

    const setColor = (r: number, g: number, b: number) => {
      if (isDark) {
        doc.setTextColor(220, 220, 230)
      } else {
        doc.setTextColor(r, g, b)
      }
    }

    doc.setFontSize(22)
    doc.setFont('helvetica', 'bold')
    setColor(31, 41, 55)
    doc.text(t('pdf_title'), pageW / 2, y, { align: 'center' })
    y += 10

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    setColor(107, 114, 128)
    doc.text(`${t('pdf_date_label')}: ${new Date().toLocaleDateString('ar-SA')}`, pageW / 2, y, { align: 'center' })
    y += 6
    doc.text(`${t('pdf_accountant_label')}: ${userName}`, pageW / 2, y, { align: 'center' })
    y += 8

    doc.setDrawColor(200, 200, 210)
    doc.setLineWidth(0.5)
    doc.line(10, y, pageW + 10, y)
    y += 8

    const fields: { label: string; value: string }[] = [
      { label: t('project_name'), value: project.project_name },
      { label: t('project_location'), value: project.project_location },
      { label: t('building_type'), value: project.building_type ?? '--' },
      { label: t('building_count'), value: project.building_count?.toString() ?? '--' },
      { label: t('apartment_count'), value: project.apartment_count?.toString() ?? '--' },
      { label: t('floor_count'), value: project.floor_count?.toString() ?? '--' },
      { label: t('approved_plans'), value: project.approved_plans === true ? t('yes') : project.approved_plans === false ? t('no') : '--' },
      { label: t('bidder'), value: project.bidder || '--' },
      { label: t('bid_issue_date'), value: project.bid_issue_date || '--' },
      { label: t('bid_validity_date'), value: project.bid_validity_date || '--' },
      { label: t('new_bid_issue'), value: project.new_bid_issue || '--' },
      { label: t('authorized_person'), value: project.authorized_person || '--' },
      { label: t('phone'), value: project.phone || '--' },
      { label: t('result'), value: project.result || '--' },
      { label: t('notes'), value: project.notes || '--' },
      { label: t('bid_link'), value: project.bid_link || '--' },
    ]

    for (const f of fields) {
      if (y > 270) {
        doc.addPage()
        y = 20
      }

      doc.setFontSize(9)
      doc.setFont('helvetica', 'bold')
      setColor(55, 65, 81)
      doc.text(`${f.label}:`, 15, y)
      const labelW = doc.getTextWidth(`${f.label}:`)

      doc.setFont('helvetica', 'normal')
      setColor(75, 85, 99)
      doc.text(f.value, 15 + labelW + 3, y)
      y += 7
    }

    doc.save(`project_${project.serial}_${project.project_name || 'untitled'}.pdf`)
  }

  return (
    <button
      onClick={exportPdf}
      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      title={t('export_pdf')}
    >
      <FileDown size={16} className="text-gray-400 dark:text-gray-500" />
    </button>
  )
}
