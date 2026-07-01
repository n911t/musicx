import { useState, useRef, useEffect, type ReactNode } from 'react'

interface EditableCellProps {
  value: string | number | boolean | null
  type?: 'text' | 'number' | 'phone' | 'url'
  options?: { label: string; value: string }[]
  onSave: (value: string) => void
  isDate?: boolean
  children?: ReactNode
}

export function EditableCell({ value, type = 'text', options, onSave, isDate, children }: EditableCellProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const selectRef = useRef<HTMLSelectElement>(null)

  useEffect(() => {
    if (editing) {
      if (inputRef.current) inputRef.current.focus()
      if (selectRef.current) selectRef.current.focus()
    }
  }, [editing])

  const display = (): string => {
    if (value === null || value === undefined) return ''
    if (typeof value === 'boolean') return value ? 'نعم' : 'لا'
    return String(value)
  }

  const startEdit = () => {
    setDraft(display())
    setEditing(true)
  }

  const commit = () => {
    setEditing(false)
    const trimmed = draft.trim()
    if (trimmed !== display()) onSave(trimmed)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') { setEditing(false) }
  }

  if (children) {
    if (editing) {
      if (options) {
        return (
          <select
            ref={selectRef as React.RefObject<HTMLSelectElement>}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            className="w-full p-1 border rounded text-sm bg-white"
            autoFocus
          >
            <option value="">--</option>
            {options.map(o => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )
      }
      if (type === 'number') {
        return (
          <input
            ref={inputRef}
            type="number"
            min="0"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            className="w-full p-1 border rounded text-sm"
            autoFocus
          />
        )
      }
    }
    return (
      <span onClick={startEdit} className="cursor-pointer hover:bg-blue-50 px-1 rounded min-h-[24px] block">
        {children}
      </span>
    )
  }

  if (options) {
    if (editing) {
      return (
        <select
          ref={selectRef as React.RefObject<HTMLSelectElement>}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="w-full p-1 border rounded text-sm bg-white"
          autoFocus
        >
          <option value="">--</option>
          {options.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      )
    }
    return (
      <span onClick={startEdit} className="cursor-pointer hover:bg-blue-50 px-1 rounded min-h-[24px] block">
        {display() || <span className="text-gray-400">--</span>}
      </span>
    )
  }

  if (isDate) {
    if (editing) {
      return (
        <input
          ref={inputRef}
          type="date"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="w-full p-1 border rounded text-sm"
          autoFocus
        />
      )
    }
    return (
      <span onClick={startEdit} className="cursor-pointer hover:bg-blue-50 px-1 rounded min-h-[24px] block">
        {display() || <span className="text-gray-400">--</span>}
      </span>
    )
  }

  if (type === 'number') {
    if (editing) {
      return (
        <input
          ref={inputRef}
          type="number"
          min="0"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="w-full p-1 border rounded text-sm"
          autoFocus
        />
      )
    }
    return (
      <span onClick={startEdit} className="cursor-pointer hover:bg-blue-50 px-1 rounded min-h-[24px] block text-center">
        {display() || <span className="text-gray-400">--</span>}
      </span>
    )
  }

  if (type === 'phone') {
    if (editing) {
      return (
        <input
          ref={inputRef}
          type="tel"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className="w-full p-1 border rounded text-sm"
          dir="ltr"
          autoFocus
        />
      )
    }
    return (
      <span onClick={startEdit} className="cursor-pointer hover:bg-blue-50 px-1 rounded min-h-[24px] block">
        {display() || <span className="text-gray-400">--</span>}
      </span>
    )
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className="w-full p-1 border rounded text-sm"
        autoFocus
      />
    )
  }

  return (
    <span onClick={startEdit} className="cursor-pointer hover:bg-blue-50 px-1 rounded min-h-[24px] block">
      {display() || <span className="text-gray-400">--</span>}
    </span>
  )
}
