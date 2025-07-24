"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, type AuthState, getCurrentUser, isAuthenticated } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Check authentication status on mount
    const checkAuth = () => {
      const user = getCurrentUser()
      const authenticated = isAuthenticated()

      setAuthState({
        user,
        isAuthenticated: authenticated,
        isLoading: false,
      })
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    const { login: authLogin } = await import("@/lib/auth")
    const result = await authLogin(email, password)

    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      })
    }

    return result
  }

  const signup = async (name: string, email: string, password: string) => {
    const { signup: authSignup } = await import("@/lib/auth")
    const result = await authSignup(name, email, password)

    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isAuthenticated: true,
        isLoading: false,
      })
    }

    return result
  }

  const logout = () => {
    const { logout: authLogout } = require("@/lib/auth")
    authLogout()

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const updateUser = (user: User) => {
    setAuthState((prev) => ({
      ...prev,
      user,
    }))
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        signup,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
