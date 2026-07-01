import { useEffect, useState } from 'react'
import type { Session, AuthChangeEvent } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'

export default function App() {
  const [session, setSession] = useState<boolean | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(!!data.session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setSession(!!session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (session === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) return <LoginPage onLogin={() => setSession(true)} />
  return <DashboardPage />
}
