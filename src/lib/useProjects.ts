import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase'
import type { Project, ProjectFormData } from './types'

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    const { data: { user } } = await supabase.auth.getUser()
    setCurrentUserId(user?.id ?? null)

    const { data, error: err } = await supabase
      .from('projects')
      .select('*, profiles(display_name)')
      .order('serial', { ascending: true })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    const mapped: Project[] = (data ?? []).map((item: Record<string, unknown>) => ({
      ...(item as Project),
      created_by_name: (item.profiles as { display_name?: string } | null)?.display_name ?? 'Unknown',
    }))
    setProjects(mapped)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const addRow = useCallback(async () => {
    const user = (await supabase.auth.getUser()).data.user
    if (!user) return null

    const { data, error: err } = await supabase
      .from('projects')
      .insert({ user_id: user.id } satisfies Partial<ProjectFormData>)
      .select('*, profiles(display_name)')
      .single()

    if (err) { setError(err.message); return null }

    const row = {
      ...(data as unknown as Project),
      created_by_name: ((data as Record<string, unknown>).profiles as { display_name?: string } | null)?.display_name ?? 'Unknown',
    }
    setProjects(prev => [...prev, row])
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

  const deleteRow = useCallback(async (id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id))

    const { error: err } = await supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (err) { setError(err.message); setProjects(prev => [...prev]) }
  }, [])

  return { projects, loading, error, currentUserId, addRow, updateField, deleteRow, reload: load }
}
