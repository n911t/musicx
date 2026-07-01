import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface NoteModalProps {
  initial: string
  onSave: (text: string) => void
  onClose: () => void
}

export function NoteModal({ initial, onSave, onClose }: NoteModalProps) {
  const { t } = useTranslation()
  const [text, setText] = useState(initial)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
        <h2 className="text-lg font-semibold mb-4">{t('notes')}</h2>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          className="w-full h-48 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          dir="auto"
        />
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 cursor-pointer"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => onSave(text)}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer"
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  )
}
