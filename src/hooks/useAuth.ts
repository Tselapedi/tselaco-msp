import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/types/auth'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  signup: (data: any) => Promise<void>
  logout: () => void
  verifyEmail: (code: string) => Promise<void>
  resendVerification: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token')
    if (token) {
      fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setUser(data.user)
          } else {
            localStorage.removeItem('token')
          }
        })
        .catch(() => {
          localStorage.removeItem('token')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    try {
      setError(null)
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Login failed')
      }

      localStorage.setItem('token', data.token)
      setUser(data.user)

      if (data.user.role === 'driver' && !data.user.isVerified) {
        router.push('/driver/verify')
      } else {
        router.push(data.user.role === 'driver' ? '/driver/dashboard' : '/dashboard')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed')
      throw error
    }
  }

  const signup = async (data: any) => {
    try {
      setError(null)
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      const responseData = await res.json()

      if (!res.ok) {
        throw new Error(responseData.error || 'Signup failed')
      }

      setUser(responseData.user)
      router.push('/verify-email')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Signup failed')
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    router.push('/')
  }

  const verifyEmail = async (code: string) => {
    try {
      setError(null)
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id, code })
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Verification failed')
      }

      setUser(prev => prev ? { ...prev, isVerified: true } : null)
      router.push(user?.role === 'driver' ? '/driver/register' : '/dashboard')
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Verification failed')
      throw error
    }
  }

  const resendVerification = async () => {
    try {
      setError(null)
      const res = await fetch('/api/auth/verify', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Failed to resend verification')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to resend verification')
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        signup,
        logout,
        verifyEmail,
        resendVerification
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 
