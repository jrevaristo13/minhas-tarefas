import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: number
  nome: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, senha: string) => Promise<boolean>
  register: (nome: string, email: string, senha: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('auth_user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error)
      localStorage.removeItem('auth_user')
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_user')
    }
  }, [user])

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 0))

      const usersRaw = localStorage.getItem('auth_users')
      const users = usersRaw ? JSON.parse(usersRaw) : []

      const foundUser = users.find(
        (u: any) =>
          u.email?.toLowerCase() === email.toLowerCase() && u.senha === senha
      )

      if (foundUser) {
        const { senha: _, ...userWithoutPassword } = foundUser
        setUser(userWithoutPassword)
        return true
      }

      return false
    } catch (error) {
      console.error('Erro no login:', error)
      return false
    }
  }

  const register = async (
    nome: string,
    email: string,
    senha: string
  ): Promise<boolean> => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 0))

      const usersRaw = localStorage.getItem('auth_users')
      const users = usersRaw ? JSON.parse(usersRaw) : []

      const emailExists = users.some(
        (u: any) => u.email?.toLowerCase() === email.toLowerCase()
      )

      if (emailExists) {
        return false
      }

      const newUser = {
        id: Date.now(),
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha
      }

      users.push(newUser)
      localStorage.setItem('auth_users', JSON.stringify(users))

      const { senha: _, ...userWithoutPassword } = newUser
      setUser(userWithoutPassword)

      return true
    } catch (error) {
      console.error('Erro no registro:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
  }

  if (!isLoaded) {
    return null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}