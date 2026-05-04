import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check current user on mount
    const checkUser = async () => {
      if (!supabase) {
        setLoading(false)
        return
      }
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setUser(session?.user || null)
      } catch (err) {
        console.log('Auth check error (mock mode):', err.message)
      }
      setLoading(false)
    }
    checkUser()

    // Listen for auth changes
    if (supabase) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user || null)
      })
      return () => subscription?.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    if (!supabase) {
      // Mock login
      setUser({ email, id: 'mock_user' })
      return { user: { email, id: 'mock_user' } }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const signup = async (email, password, fullName) => {
    if (!supabase) {
      // Mock signup
      setUser({ email, id: 'mock_user' })
      return { user: { email, id: 'mock_user' } }
    }
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    if (data.user) {
      await supabase.from('profiles').insert({ id: data.user.id, email, full_name: fullName })
    }
    return data
  }

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut()
    }
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
