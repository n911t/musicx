import { useMemo, useState, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from '@tanstack/react-table'
import { Plus, ExternalLink, StickyNote, Trash2, GripVertical } from 'lucide-react'
import { EditableCell } from './EditableCell'
import { NoteModal } from './NoteModal'
import { ExpiryCell } from './ExpiryCell'
import { PdfExportButton } from './PdfExportButton'
import { getExpiryInfo } from '../lib/expiry'
import { useTheme } from '../context/ThemeContext'
import type { Project } from '../lib/types'

interface DataTableProps {
  projects: Project[]
  loading: boolean
  error: string | null
  currentUserId: string | null
  onAddRow: () => void
  onUpdateField: (id: string, field: keyof Project, value: unknown) => void
  onDeleteRow: (id: string) => void
  searchQuery: string
}

const columnColors: Record<string, { header: string; cell: string; cellDark: string }> = {
  serial:              { header: '#6b7280', cell: '#f9fafb', cellDark: '#1e293b' },
  created_by:          { header: '#f59e0b', cell: '#fffbeb', cellDark: '#292524' },
  project_name:        { header: '#3b82f6', cell: '#eff6ff', cellDark: '#172554' },
  project_location:    { header: '#14b8a6', cell: '#f0fdfa', cellDark: '#134e4a' },
  building_type:       { header: '#8b5cf6', cell: '#f5f3ff', cellDark: '#1e1b4b' },
  building_count:      { header: '#a855f7', cell: '#faf5ff', cellDark: '#2e1065' },
  apartment_count:     { header: '#ec4899', cell: '#fdf2f8', cellDark: '#3b0764' },
  floor_count:         { header: '#f97316', cell: '#fff7ed', cellDark: '#2d1b0e' },
  approved_plans:      { header: '#22c55e', cell: '#f0fdf4', cellDark: '#052e16' },
  bidder:              { header: '#06b6d4', cell: '#ecfeff', cellDark: '#083344' },
  bid_issue_date:      { header: '#f43f5e', cell: '#fff1f2', cellDark: '#2d0a0e' },
  bid_validity_date:   { header: '#ef4444', cell: '#fef2f2', cellDark: '#2d0a0e' },
  new_bid_issue:       { header: '#0ea5e9', cell: '#f0f9ff', cellDark: '#0c4a6e' },
  authorized_person:   { header: '#7c3aed', cell: '#f5f3ff', cellDark: '#1e1b4b' },
  phone:               { header: '#d946ef', cell: '#fdf4ff', cellDark: '#2d0a3e' },
  result:              { header: '#10b981', cell: '#ecfdf5', cellDark: '#022c22' },
  notes:               { header: '#eab308', cell: '#fefce8', cellDark: '#292524' },
  bid_link:            { header: '#64748b', cell: '#f8fafc', cellDark: '#0f172a' },
}

const defaultColor = { header: '#6b7280', cell: '#f9fafb', cellDark: '#1e293b' }

type FilterType = 'all' | 'active' | 'expiring' | 'expired' | 'approved' | 'pending' | 'yes' | 'no'

export function DataTable({
  projects, loading, error, currentUserId,
  onAddRow, onUpdateField, onDeleteRow, searchQuery,
}: DataTableProps) {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const [noteTarget, setNoteTarget] = useState<{ id: string; text: string } | null>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnOrder, setColumnOrder] = useState<string[]>([])
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

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
    'قيد الدراسة': 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700',
    'تمت الموافقة': 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700',
    'تم الرفض': 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
  }

  const getCol = (colId: string) => columnColors[colId] ?? defaultColor

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('filter_all') },
    { key: 'active', label: t('filter_active') },
    { key: 'expiring', label: t('filter_expiring') },
    { key: 'expired', label: t('filter_expired') },
    { key: 'approved', label: t('filter_approved') },
    { key: 'pending', label: t('filter_pending') },
    { key: 'yes', label: t('filter_yes') },
    { key: 'no', label: t('filter_no') },
  ]

  const filteredData = useMemo(() => {
    let data = projects

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      data = data.filter(p =>
        (p.project_name?.toLowerCase() || '').includes(q) ||
        (p.project_location?.toLowerCase() || '').includes(q) ||
        (p.bidder?.toLowerCase() || '').includes(q) ||
        (p.phone || '').includes(q) ||
        (p.authorized_person?.toLowerCase() || '').includes(q) ||
        (p.bid_issue_date || '').includes(q) ||
        (p.bid_validity_date || '').includes(q) ||
        (p.result?.toLowerCase() || '').includes(q)
      )
    }

    if (activeFilter === 'all') return data

    return data.filter(p => {
      const info = p.bid_validity_date ? getExpiryInfo(p.bid_validity_date) : null
      switch (activeFilter) {
        case 'active': return info?.status === 'active'
        case 'expiring': return info?.status === 'warning'
        case 'expired': return info?.status === 'expired'
        case 'approved': return p.result === 'تمت الموافقة'
        case 'pending': return p.result === 'قيد الدراسة'
        case 'yes': return p.approved_plans === true
        case 'no': return p.approved_plans === false
        default: return true
      }
    })
  }, [projects, searchQuery, activeFilter])

  const handleDatePick = (id: string, value: string) => {
    onUpdateField(id, 'bid_validity_date', value || null)
  }

  const handleDragStart = useCallback((e: React.DragEvent, colId: string) => {
    e.dataTransfer.setData('text/plain', colId)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, targetColId: string) => {
    e.preventDefault()
    const sourceColId = e.dataTransfer.getData('text/plain')
    if (!sourceColId || sourceColId === targetColId) return

    setColumnOrder(prev => {
      const ids = ['serial','actions','created_by','project_name','project_location','building_type','building_count','apartment_count','floor_count','approved_plans','bidder','bid_issue_date','bid_validity_date','new_bid_issue','authorized_person','phone','result','notes','bid_link']
      const base = prev.length > 0 ? prev : ids
      const order = [...base]
      const srcIdx = order.indexOf(sourceColId)
      const tgtIdx = order.indexOf(targetColId)
      if (srcIdx === -1 || tgtIdx === -1) return prev
      const [removed] = order.splice(srcIdx, 1)
      order.splice(tgtIdx, 0, removed)
      return order
    })
  }, [])

  const defaultCols = useMemo<ColumnDef<Project>[]>(() => [
    {
      id: 'serial',
      header: t('serial'),
      accessorKey: 'serial',
      size: 50,
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-gray-400 dark:text-gray-500 text-center block text-xs font-medium">{row.original.serial}</span>
      ),
    },
    {
      id: 'actions',
      header: '',
      size: 90,
      enableSorting: false,
      cell: ({ row }) => {
        const isOwn = row.original.user_id === currentUserId
        const isDeleting = deleteConfirm === row.original.id
        return (
          <div className="flex items-center justify-center gap-0.5">
            <PdfExportButton project={row.original} userName={row.original.created_by_name} />
            {isOwn && (
              isDeleting ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => { onDeleteRow(row.original.id); setDeleteConfirm(null) }}
                    className="p-1 rounded-lg bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-semibold cursor-pointer hover:bg-red-200 dark:hover:bg-red-900/60"
                  >
                    {t('delete_row')}
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    className="p-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 text-xs cursor-pointer"
                  >
                    {t('cancel')}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(row.original.id)}
                  className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
                  title={t('delete_row')}
                >
                  <Trash2 size={14} className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400" />
                </button>
              )
            )}
          </div>
        )
      },
    },
    {
      id: 'created_by',
      header: t('created_by'),
      accessorKey: 'created_by_name',
      size: 80,
      enableSorting: true,
      cell: ({ row }) => {
        const isOwn = row.original.user_id === currentUserId
        return (
          <span className="inline-flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
            {isOwn ? (
              <span className="text-gray-500 dark:text-gray-400">{row.original.created_by_name}</span>
            ) : (
              <>
                <span className="text-amber-500 dark:text-amber-400" title={t('read_only')}>🔒</span>
                <span className="text-gray-400 dark:text-gray-500">{row.original.created_by_name}</span>
              </>
            )}
          </span>
        )
      },
    },
    {
      id: 'project_name',
      header: t('project_name'),
      accessorKey: 'project_name',
      enableSorting: true,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.project_name}
          onSave={v => onUpdateField(row.original.id, 'project_name', v)}
          disabled={row.original.user_id !== currentUserId}
        />
      ),
    },
    {
      id: 'project_location',
      header: t('project_location'),
      accessorKey: 'project_location',
      enableSorting: true,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.project_location}
          onSave={v => onUpdateField(row.original.id, 'project_location', v)}
          disabled={row.original.user_id !== currentUserId}
        />
      ),
    },
    {
      id: 'building_type',
      header: t('building_type'),
      accessorKey: 'building_type',
      size: 100,
      enableSorting: true,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.building_type}
          options={buildingTypeOptions}
          onSave={v => onUpdateField(row.original.id, 'building_type', v || null)}
          disabled={row.original.user_id !== currentUserId}
        />
      ),
    },
    {
      id: 'building_count',
      header: t('building_count'),
      accessorKey: 'building_count',
      size: 90,
      enableSorting: true,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.building_count}
          type="number"
          onSave={v => onUpdateField(row.original.id, 'building_count', v === '' ? null : Number(v))}
          disabled={row.original.user_id !== currentUserId}
        />
      ),
    },
    {
      id: 'apartment_count',
      header: t('apartment_count'),
      accessorKey: 'apartment_count',
      size: 90,
      enableSorting: true,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.apartment_count}
          type="number"
          onSave={v => onUpdateField(row.original.id, 'apartment_count', v === '' ? null : Number(v))}
          disabled={row.original.user_id !== currentUserId}
        />
      ),
    },
    {
      id: 'floor_count',
      header: t('floor_count'),
      accessorKey: 'floor_count',
      size: 90,
      enableSorting: true,
      cell: ({ row }) => {
        const val = row.original.floor_count ?? 0
        const intensity = maxFloors > 0 ? val / maxFloors : 0
        const opacity = 0.3 + intensity * 0.7
        const isOwn = row.original.user_id === currentUserId
        return (
          <EditableCell
            value={val}
            type="number"
            onSave={v => onUpdateField(row.original.id, 'floor_count', v === '' ? null : Number(v))}
            disabled={!isOwn}
          >
            <span
              className="font-semibold text-center block text-sm"
              style={{ color: `rgba(37, 99, 235, ${opacity})` }}
            >
              {val || <span className="text-gray-400 dark:text-gray-600">--</span>}
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
      enableSorting: true,
      cell: ({ row }) => {
        const boolVal = row.original.approved_plans
        const strVal = boolVal === true ? 'yes' : boolVal === false ? 'no' : ''
        const isOwn = row.original.user_id === currentUserId
        return (
          <EditableCell
            value={strVal}
            options={yesNoOptions}
            onSave={v => onUpdateField(row.original.id, 'approved_plans', v === 'yes' ? true : v === 'no' ? false : null)}
            disabled={!isOwn}
          >
            {boolVal === true ? (
              <span className="text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700 px-2.5 py-0.5 rounded-lg text-xs font-semibold">
                {t('yes')}
              </span>
            ) : boolVal === false ? (
              <span className="text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-2.5 py-0.5 rounded-lg text-xs font-semibold">
                {t('no')}
              </span>
            ) : (
              <span className="text-gray-400 dark:text-gray-600">--</span>
            )}
          </EditableCell>
        )
      },
    },
    {
      id: 'bidder',
      header: t('bidder'),
      accessorKey: 'bidder',
      enableSorting: true,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.bidder}
          onSave={v => onUpdateField(row.original.id, 'bidder', v)}
          disabled={row.original.user_id !== currentUserId}
        />
      ),
    },
    {
      id: 'bid_issue_date',
      header: t('bid_issue_date'),
      accessorKey: 'bid_issue_date',
      size: 110,
      enableSorting: true,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.bid_issue_date}
          isDate
          onSave={v => onUpdateField(row.original.id, 'bid_issue_date', v || null)}
          disabled={row.original.user_id !== currentUserId}
        />
      ),
    },
    {
      id: 'bid_validity_date',
      header: t('bid_validity_date'),
      accessorKey: 'bid_validity_date',
      size: 130,
      enableSorting: true,
      cell: ({ row }) => {
        const isOwn = row.original.user_id === currentUserId
        return (
          <div className="relative">
            <div
              onClick={() => {
                if (!isOwn) return
                dateInputRef.current?.showPicker?.() ?? dateInputRef.current?.click()
              }}
              className={isOwn ? 'cursor-pointer' : ''}
            >
              <ExpiryCell dateStr={row.original.bid_validity_date} />
            </div>
            {isOwn && (
              <input
                ref={dateInputRef}
                type="date"
                defaultValue={row.original.bid_validity_date || ''}
                onChange={e => handleDatePick(row.original.id, e.target.value)}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
            )}
          </div>
        )
      },
    },
    {
      id: 'new_bid_issue',
      header: t('new_bid_issue'),
      accessorKey: 'new_bid_issue',
      enableSorting: true,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.new_bid_issue}
          onSave={v => onUpdateField(row.original.id, 'new_bid_issue', v)}
          disabled={row.original.user_id !== currentUserId}
        />
      ),
    },
    {
      id: 'authorized_person',
      header: t('authorized_person'),
      accessorKey: 'authorized_person',
      enableSorting: true,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.authorized_person}
          onSave={v => onUpdateField(row.original.id, 'authorized_person', v)}
          disabled={row.original.user_id !== currentUserId}
        />
      ),
    },
    {
      id: 'phone',
      header: t('phone'),
      accessorKey: 'phone',
      size: 110,
      enableSorting: true,
      cell: ({ row }) => (
        <EditableCell
          value={row.original.phone}
          type="phone"
          onSave={v => onUpdateField(row.original.id, 'phone', v)}
          disabled={row.original.user_id !== currentUserId}
        />
      ),
    },
    {
      id: 'result',
      header: t('result'),
      accessorKey: 'result',
      size: 120,
      enableSorting: true,
      cell: ({ row }) => {
        const val = row.original.result
        const colorClass = resultColors[val] || ''
        const isOwn = row.original.user_id === currentUserId
        return (
          <EditableCell
            value={val}
            options={resultOptions}
            onSave={v => onUpdateField(row.original.id, 'result', v)}
            disabled={!isOwn}
          >
            {val ? (
              <span className={`inline-block px-3 py-0.5 rounded-lg text-xs font-semibold border ${colorClass}`}>
                {val}
              </span>
            ) : (
              <span className="text-gray-400 dark:text-gray-600">--</span>
            )}
          </EditableCell>
        )
      },
    },
    {
      id: 'notes',
      header: t('notes'),
      accessorKey: 'notes',
      size: 70,
      enableSorting: false,
      cell: ({ row }) => {
        const hasNotes = row.original.notes && row.original.notes.trim().length > 0
        const isOwn = row.original.user_id === currentUserId
        return (
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (!isOwn) return
                setNoteTarget({ id: row.original.id, text: row.original.notes })
              }}
              className={`p-1.5 rounded-lg transition-colors ${isOwn ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700' : 'cursor-default'}`}
              title={isOwn ? (row.original.notes || t('notes')) : t('read_only')}
            >
              <StickyNote
                size={18}
                className={hasNotes ? 'text-green-600 dark:text-green-400 fill-green-200 dark:fill-green-800' : isOwn ? 'text-red-400 dark:text-red-500' : 'text-gray-300 dark:text-gray-600'}
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
      size: 100,
      enableSorting: false,
      cell: ({ row }) => {
        const url = row.original.bid_link
        const isOwn = row.original.user_id === currentUserId
        return url ? (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline inline-flex items-center gap-1 text-xs hover:text-blue-800 dark:hover:text-blue-300"
          >
            {t('bid_link')} <ExternalLink size={12} />
          </a>
        ) : (
          <EditableCell
            value={url}
            type="url"
            onSave={v => onUpdateField(row.original.id, 'bid_link', v)}
            disabled={!isOwn}
          />
        )
      },
    },
  ], [t, buildingTypeOptions, resultOptions, yesNoOptions, onUpdateField, maxFloors, currentUserId, deleteConfirm, onDeleteRow, searchQuery, activeFilter])

  const table = useReactTable({
    data: filteredData,
    columns: defaultCols,
    state: { sorting, columnOrder: columnOrder.length > 0 ? columnOrder : undefined },
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    defaultColumn: { minSize: 80 },
    enableSortingRemoval: false,
  })

  const handleSaveNote = (text: string) => {
    if (!noteTarget) return
    onUpdateField(noteTarget.id, 'notes', text)
    setNoteTarget(null)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-700 dark:text-red-400 text-sm">
        {error}
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap items-center gap-2">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setActiveFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                activeFilter === f.key
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={onAddRow}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 text-sm font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
        >
          <Plus size={18} />
          {t('add_row')}
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
        <table className="w-full border-collapse text-sm" style={{ minWidth: 1560 }}>
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => {
                  const col = getCol(h.id)
                  const canSort = h.column.getCanSort()
                  const sorted = h.column.getIsSorted()
                  return (
                    <th
                      key={h.id}
                      draggable
                      onDragStart={e => handleDragStart(e, h.id)}
                      onDragOver={handleDragOver}
                      onDrop={e => handleDrop(e, h.id)}
                      className="px-3 py-3 text-right font-semibold text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-700 select-none"
                      style={{
                        width: h.getSize() !== 150 ? h.getSize() : undefined,
                        background: isDark ? col.cellDark : col.header,
                        color: isDark ? '#94a3b8' : '#ffffff',
                        cursor: 'grab',
                      }}
                    >
                      <div
                        className="flex items-center gap-1.5"
                        onClick={() => canSort && h.column.toggleSorting()}
                        style={{ cursor: canSort ? 'pointer' : 'default' }}
                      >
                        <GripVertical size={12} className="opacity-40 shrink-0" />
                        <span>{flexRender(h.column.columnDef.header, h.getContext())}</span>
                        {{
                          asc: ' ↑',
                          desc: ' ↓',
                        }[sorted as string] ?? ''}
                      </div>
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={defaultCols.length} className="text-center py-16 text-gray-400 dark:text-gray-600">
                  <div className="flex flex-col items-center gap-2">
                    <Plus size={32} className="text-gray-300 dark:text-gray-700" />
                    <span>{t('no_data')}</span>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 dark:border-gray-800 transition-colors ${
                    row.original.user_id !== currentUserId
                      ? 'opacity-80'
                      : 'hover:bg-blue-50/40 dark:hover:bg-blue-900/10'
                  }`}
                >
                  {row.getVisibleCells().map(cell => {
                    const col = getCol(cell.column.id)
                    return (
                      <td
                        key={cell.id}
                        className="px-3 py-2.5 border-l border-gray-100 dark:border-gray-800 last:border-l-0"
                        style={{
                          background: isDark ? col.cellDark : col.cell,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
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
