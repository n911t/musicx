import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { Plus, ExternalLink, StickyNote } from 'lucide-react'
import { EditableCell } from './EditableCell'
import { NoteModal } from './NoteModal'
import { ExpiryCell } from './ExpiryCell'
import type { Project } from '../lib/types'

interface DataTableProps {
  projects: Project[]
  loading: boolean
  error: string | null
  onAddRow: () => void
  onUpdateField: (id: string, field: keyof Project, value: unknown) => void
}

export function DataTable({ projects, loading, error, onAddRow, onUpdateField }: DataTableProps) {
  const { t, i18n } = useTranslation()
  const [noteTarget, setNoteTarget] = useState<{ id: string; text: string } | null>(null)
  const [editingDate, setEditingDate] = useState<string | null>(null)
  const [dateDraft, setDateDraft] = useState('')
  const isRtl = i18n.language === 'ar'

  const maxFloors = useMemo(() =>
    Math.max(...projects.map(p => p.floor_count ?? 0), 1),
    [projects]
  )

  const buildingTypeOptions = [
    { label: t('vertical'), value: 'عمودي' },
    { label: t('horizontal'), value: 'افقي' },
  ]

  const resultOptions = [
    { label: t('result_pending'), value: 'قيد الدراسة' },
    { label: t('result_approved'), value: 'تمت الموافقة' },
    { label: t('result_rejected'), value: 'تم الرفض' },
  ]

  const yesNoOptions = [
    { label: t('yes'), value: 'yes' },
    { label: t('no'), value: 'no' },
  ]

  const resultColors: Record<string, string> = {
    'قيد الدراسة': 'text-amber-600 bg-amber-50',
    'تمت الموافقة': 'text-green-700 bg-green-50',
    'تم الرفض': 'text-red-600 bg-red-50',
  }

  const columns = useMemo<ColumnDef<Project>[]>(() => [
    {
      id: 'serial',
      header: t('serial'),
      accessorKey: 'serial',
      size: 50,
      cell: ({ row }) => (
        <span className="text-gray-500 text-center block">{row.original.serial}</span>
      ),
    },
    {
      id: 'project_name',
      header: t('project_name'),
      accessorKey: 'project_name',
      cell: ({ row }) => (
        <EditableCell
          value={row.original.project_name}
          onSave={v => onUpdateField(row.original.id, 'project_name', v)}
        />
      ),
    },
    {
      id: 'project_location',
      header: t('project_location'),
      accessorKey: 'project_location',
      cell: ({ row }) => (
        <EditableCell
          value={row.original.project_location}
          onSave={v => onUpdateField(row.original.id, 'project_location', v)}
        />
      ),
    },
    {
      id: 'building_type',
      header: t('building_type'),
      accessorKey: 'building_type',
      size: 100,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.building_type}
          options={buildingTypeOptions}
          onSave={v => onUpdateField(row.original.id, 'building_type', v || null)}
        />
      ),
    },
    {
      id: 'building_count',
      header: t('building_count'),
      accessorKey: 'building_count',
      size: 90,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.building_count}
          type="number"
          onSave={v => onUpdateField(row.original.id, 'building_count', v === '' ? null : Number(v))}
        />
      ),
    },
    {
      id: 'apartment_count',
      header: t('apartment_count'),
      accessorKey: 'apartment_count',
      size: 90,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.apartment_count}
          type="number"
          onSave={v => onUpdateField(row.original.id, 'apartment_count', v === '' ? null : Number(v))}
        />
      ),
    },
    {
      id: 'floor_count',
      header: t('floor_count'),
      accessorKey: 'floor_count',
      size: 90,
      cell: ({ row }) => {
        const val = row.original.floor_count ?? 0
        const intensity = maxFloors > 0 ? val / maxFloors : 0
        const opacity = 0.3 + intensity * 0.7
        return (
          <EditableCell
            value={val}
            type="number"
            onSave={v => onUpdateField(row.original.id, 'floor_count', v === '' ? null : Number(v))}
          >
            <span
              className="font-medium text-center block"
              style={{ color: `rgba(37, 99, 235, ${opacity})` }}
            >
              {val || <span className="text-gray-400">--</span>}
            </span>
          </EditableCell>
        )
      },
    },
    {
      id: 'approved_plans',
      header: t('approved_plans'),
      accessorKey: 'approved_plans',
      size: 100,
      cell: ({ row }) => {
        const boolVal = row.original.approved_plans
        const strVal = boolVal === true ? 'yes' : boolVal === false ? 'no' : ''
        return (
          <EditableCell
            value={strVal}
            options={yesNoOptions}
            onSave={v => onUpdateField(row.original.id, 'approved_plans', v === 'yes' ? true : v === 'no' ? false : null)}
          >
            {boolVal === true ? (
              <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded text-xs font-medium">
                {t('yes')}
              </span>
            ) : boolVal === false ? (
              <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded text-xs font-medium">
                {t('no')}
              </span>
            ) : (
              <span className="text-gray-400">--</span>
            )}
          </EditableCell>
        )
      },
    },
    {
      id: 'bidder',
      header: t('bidder'),
      accessorKey: 'bidder',
      cell: ({ row }) => (
        <EditableCell
          value={row.original.bidder}
          onSave={v => onUpdateField(row.original.id, 'bidder', v)}
        />
      ),
    },
    {
      id: 'bid_issue_date',
      header: t('bid_issue_date'),
      accessorKey: 'bid_issue_date',
      size: 110,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.bid_issue_date}
          isDate
          onSave={v => onUpdateField(row.original.id, 'bid_issue_date', v || null)}
        />
      ),
    },
    {
      id: 'bid_validity_date',
      header: t('bid_validity_date'),
      accessorKey: 'bid_validity_date',
      size: 130,
      cell: ({ row }) => {
        const id = row.original.id
        if (editingDate === id) {
          return (
            <input
              type="date"
              value={dateDraft}
              autoFocus
              onChange={e => setDateDraft(e.target.value)}
              onBlur={e => {
                onUpdateField(id, 'bid_validity_date', e.target.value || null)
                setEditingDate(null)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                if (e.key === 'Escape') setEditingDate(null)
              }}
              className="w-full p-1 border rounded text-sm"
            />
          )
        }
        return (
          <div
            onClick={() => {
              setEditingDate(id)
              setDateDraft(row.original.bid_validity_date || '')
            }}
            className="cursor-pointer"
          >
            <ExpiryCell dateStr={row.original.bid_validity_date} />
          </div>
        )
      },
    },
    {
      id: 'new_bid_issue',
      header: t('new_bid_issue'),
      accessorKey: 'new_bid_issue',
      cell: ({ row }) => (
        <EditableCell
          value={row.original.new_bid_issue}
          onSave={v => onUpdateField(row.original.id, 'new_bid_issue', v)}
        />
      ),
    },
    {
      id: 'authorized_person',
      header: t('authorized_person'),
      accessorKey: 'authorized_person',
      cell: ({ row }) => (
        <EditableCell
          value={row.original.authorized_person}
          onSave={v => onUpdateField(row.original.id, 'authorized_person', v)}
        />
      ),
    },
    {
      id: 'phone',
      header: t('phone'),
      accessorKey: 'phone',
      size: 110,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.phone}
          type="phone"
          onSave={v => onUpdateField(row.original.id, 'phone', v)}
        />
      ),
    },
    {
      id: 'result',
      header: t('result'),
      accessorKey: 'result',
      size: 110,
      cell: ({ row }) => {
        const val = row.original.result
        const colorClass = resultColors[val] || ''
        return (
          <EditableCell
            value={val}
            options={resultOptions}
            onSave={v => onUpdateField(row.original.id, 'result', v)}
          >
            {val ? (
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
                {val}
              </span>
            ) : (
              <span className="text-gray-400">--</span>
            )}
          </EditableCell>
        )
      },
    },
    {
      id: 'notes',
      header: t('notes'),
      accessorKey: 'notes',
      size: 90,
      cell: ({ row }) => {
        const hasNotes = row.original.notes && row.original.notes.trim().length > 0
        return (
          <div className="flex justify-center">
            <button
              onClick={() => setNoteTarget({ id: row.original.id, text: row.original.notes })}
              className="cursor-pointer"
              title={row.original.notes || t('notes')}
            >
              <StickyNote
                size={20}
                className={hasNotes ? 'text-green-600 fill-green-200' : 'text-red-400'}
              />
            </button>
          </div>
        )
      },
    },
    {
      id: 'bid_link',
      header: t('bid_link'),
      accessorKey: 'bid_link',
      size: 120,
      cell: ({ row }) => {
        const url = row.original.bid_link
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline inline-flex items-center gap-1"
          >
            {t('bid_link')} <ExternalLink size={14} />
          </a>
        ) : (
          <EditableCell
            value={url}
            type="url"
            onSave={v => onUpdateField(row.original.id, 'bid_link', v)}
          />
        )
      },
    },
  ], [t, buildingTypeOptions, resultOptions, yesNoOptions, onUpdateField, editingDate, dateDraft, maxFloors])

  const table = useReactTable({
    data: projects,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: { minSize: 80 },
  })

  const handleSaveNote = (text: string) => {
    if (!noteTarget) return
    onUpdateField(noteTarget.id, 'notes', text)
    setNoteTarget(null)
  }

  if (loading) {
    return <div className="flex justify-center py-12 text-gray-500">{t('loading')}</div>
  }

  if (error) {
    return <div className="flex justify-center py-12 text-red-500">{error}</div>
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onAddRow}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm cursor-pointer"
        >
          <Plus size={18} />
          {t('add_row')}
        </button>
      </div>

      <div className="overflow-auto border rounded-lg shadow-sm" dir={isRtl ? 'rtl' : 'ltr'}>
        <table className="w-full border-collapse text-sm" style={{ minWidth: 1450 }}>
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id} className="bg-gray-50 border-b">
                {hg.headers.map(h => (
                  <th
                    key={h.id}
                    className="px-3 py-2 text-right font-medium text-gray-600 border-l last:border-l-0 whitespace-nowrap"
                    style={{ width: h.getSize() !== 150 ? h.getSize() : undefined }}
                  >
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12 text-gray-400">
                  {t('no_data')}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b hover:bg-gray-50 even:bg-gray-50/50">
                  {row.getVisibleCells().map(cell => (
                    <td
                      key={cell.id}
                      className="px-3 py-2 border-l last:border-l-0"
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {noteTarget && (
        <NoteModal
          initial={noteTarget.text}
          onSave={handleSaveNote}
          onClose={() => setNoteTarget(null)}
        />
      )}
    </>
  )
}
