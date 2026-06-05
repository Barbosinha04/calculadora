import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { User } from '../types/schema'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email! } : null)
      setLoading(false)
    })

    // Listen for changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ? { id: session.user.id, email: session.user.email! } : null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = (email: string) => supabase.auth.signInWithOtp({ email })
  const signOut = () => supabase.auth.signOut()

  return { user, loading, signIn, signOut }
}
