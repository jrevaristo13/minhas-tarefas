import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: number;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  register: (nome: string, email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Carregar usuário ao iniciar
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
      localStorage.removeItem('auth_user');
    }
    setIsLoaded(true);
  }, []);

  // Salvar usuário quando mudar
  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('auth_user');
    }
  }, [user]);

  // ✅ LOGIN - Corrigido
  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      // Aguarda um tick para garantir que o localStorage está sincronizado
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const usersRaw = localStorage.getItem('auth_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      
      // Busca usuário com email E senha (comparação case-insensitive)
      const foundUser = users.find((u: any) => 
        u.email?.toLowerCase() === email.toLowerCase() && 
        u.senha === senha
      );
      
      if (foundUser) {
        // Remove a senha do objeto do usuário (segurança básica)
        const { senha: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  // ✅ REGISTER - Corrigido
  const register = async (nome: string, email: string, senha: string): Promise<boolean> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 0));
      
      const usersRaw = localStorage.getItem('auth_users');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      
      // Verifica se email já existe (case-insensitive)
      const emailExists = users.some((u: any) => 
        u.email?.toLowerCase() === email.toLowerCase()
      );
      
      if (emailExists) {
        return false; // Email já cadastrado
      }

      // Cria novo usuário
      const newUser = {
        id: Date.now(),
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: senha // Em produção, use hash!
      };

      users.push(newUser);
      localStorage.setItem('auth_users', JSON.stringify(users));
      
      // Loga automaticamente após registro
      const { senha: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      
      return true;
    } catch (error) {
      console.error('Erro no registro:', error);
      return false;
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    // Opcional: limpar tarefas ao sair
    // localStorage.removeItem('tarefas');
  };

  // Enquanto carrega, não renderiza children para evitar erro
  if (!isLoaded) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};