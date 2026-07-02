import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'

interface NoteModalProps {
  initial: string
  onSave: (text: string) => void
  onClose: () => void
}

export function NoteModal({ initial, onSave, onClose }: NoteModalProps) {
  const { t } = useTranslation()
  const [text, setText] = useState(initial)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">{t('notes')}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
            <X size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="p-5">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            className="w-full h-48 p-4 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 text-sm leading-relaxed"
            dir="auto"
            placeholder={t('notes_placeholder')}
          />
        </div>
        <div className="flex justify-end gap-3 px-5 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 font-medium transition-all cursor-pointer"
          >
            {t('cancel')}
          </button>
          <button
            onClick={() => onSave(text)}
            className="px-5 py-2.5 text-sm rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-semibold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  )
}
