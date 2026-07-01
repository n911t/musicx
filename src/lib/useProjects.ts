import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Project, ProjectFormData } from './types'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase
      .from('projects')
      .select('*')
      .order('serial', { ascending: true })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }
    setProjects(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const addRow = useCallback(async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return null

    const { data, error: err } = await supabase
      .from('projects')
      .insert({ user_id: user.id } satisfies Partial<ProjectFormData>)
      .select()
      .single()

    if (err) { setError(err.message); return null }
    setProjects(prev => [...prev, data])
    return data
  }, [])

  const updateField = useCallback(async (id: string, field: keyof Project, value: unknown) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))

    const { error: err } = await supabase
      .from('projects')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', id)

    if (err) setError(err.message)
  }, [])

  return { projects, loading, error, addRow, updateField, reload: load }
}
