import { useState, useRef, useEffect, type ReactNode } from 'react'

interface EditableCellProps {
  value: string | number | boolean | null
  type?: 'text' | 'number' | 'phone' | 'url'
  options?: { label: string; value: string }[]
  onSave: (value: string) => void
  isDate?: boolean
  children?: ReactNode
  disabled?: boolean
}

export function EditableCell({ value, type = 'text', options, onSave, isDate, children, disabled }: EditableCellProps) {
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
    if (disabled) return
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

  const wrapperClass = disabled
    ? 'px-1 rounded min-h-[24px] block opacity-80'
    : 'cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 px-1 rounded min-h-[24px] block'

  const inputClass = 'w-full p-1 border rounded text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200'

  if (children) {
    if (editing && !disabled) {
      if (options) {
        return (
          <select
            ref={selectRef as React.RefObject<HTMLSelectElement>}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            className={inputClass}
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
            className={inputClass}
            autoFocus
          />
        )
      }
    }
    return (
      <span onClick={startEdit} className={wrapperClass}>
        {children}
      </span>
    )
  }

  if (options) {
    if (editing && !disabled) {
      return (
        <select
          ref={selectRef as React.RefObject<HTMLSelectElement>}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className={inputClass}
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
      <span onClick={startEdit} className={wrapperClass}>
        {display() || <span className="text-gray-400 dark:text-gray-600">--</span>}
      </span>
    )
  }

  if (isDate) {
    if (editing && !disabled) {
      return (
        <input
          ref={inputRef}
          type="date"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className={inputClass}
          autoFocus
        />
      )
    }
    return (
      <span onClick={startEdit} className={wrapperClass}>
        {display() || <span className="text-gray-400 dark:text-gray-600">--</span>}
      </span>
    )
  }

  if (type === 'number') {
    if (editing && !disabled) {
      return (
        <input
          ref={inputRef}
          type="number"
          min="0"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className={inputClass}
          autoFocus
        />
      )
    }
    return (
      <span onClick={startEdit} className={`${wrapperClass} text-center`}>
        {display() || <span className="text-gray-400 dark:text-gray-600">--</span>}
      </span>
    )
  }

  if (type === 'phone') {
    if (editing && !disabled) {
      return (
        <input
          ref={inputRef}
          type="tel"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          className={inputClass}
          dir="ltr"
          autoFocus
        />
      )
    }
    return (
      <span onClick={startEdit} className={wrapperClass}>
        {display() || <span className="text-gray-400 dark:text-gray-600">--</span>}
      </span>
    )
  }

  if (editing && !disabled) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={e => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKeyDown}
        className={inputClass}
        autoFocus
      />
    )
  }

  return (
    <span onClick={startEdit} className={wrapperClass}>
      {display() || <span className="text-gray-400 dark:text-gray-600">--</span>}
    </span>
  )
}
