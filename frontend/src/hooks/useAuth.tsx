"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { authService } from '../services/authService';
import { apiService } from '../services/apiService';

interface User {
  id: string;
  email: string;
  name?: string;
  company?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // Tentar recuperar usuário do localStorage na inicialização
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          return JSON.parse(savedUser);
        } catch (e) {
          console.error('Erro ao parsear usuário salvo:', e);
          localStorage.removeItem('user');
        }
      }
    }
    return null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthenticated = !!user;

  const refreshUser = async () => {
    try {
      // Limpar tokens malformados primeiro
      authService.clearInvalidTokens();
      
      if (authService.isAuthenticated()) {
        const userData = await apiService.getProfile();
        setUser(userData);
        // Salvar usuário no localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('user', JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      authService.clearTokens();
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('🚀 Iniciando processo de login...');
      const response = await authService.login({ email, password });
      console.log('✅ Login bem-sucedido, salvando tokens...');
      authService.setTokens(response.access_token, response.refresh_token);
      setUser(response.user);
      // Salvar usuário no localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      console.log('👤 Usuário definido:', response.user);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('❌ Erro no login:', error);
      throw new Error(error.message || 'Erro no login');
    }
  };

  const loginWithGoogle = async (credential: string) => {
    try {
      const response = await authService.googleAuth(credential);
      authService.setTokens(response.access_token, response.refresh_token);
      setUser(response.user);
      router.push('/dashboard');
    } catch (error: any) {
      throw new Error(error.message || 'Erro na autenticação Google');
    }
  };

  const logout = () => {
    authService.clearTokens();
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
    }
    router.push('/login');
  };

  // Verificar autenticação apenas em rotas protegidas
  useEffect(() => {
    // Se estiver na página inicial, não fazer nenhuma verificação
    if (pathname === '/') {
      setIsLoading(false);
      return;
    }
    
    // Se estiver em qualquer outra página, verificar autenticação
    const checkAuth = async () => {
      try {
        console.log('🔍 Verificando autenticação...');
        
        // Limpar tokens malformados primeiro
        const cleared = authService.clearInvalidTokens();
        if (cleared) {
          console.log('🧹 Tokens malformados limpos');
          setUser(null);
          setIsLoading(false);
          return;
        }
        
        if (authService.isAuthenticated()) {
          console.log('✅ Usuário autenticado, verificando perfil...');
          await refreshUser();
        } else {
          console.log('❌ Usuário não autenticado');
          setUser(null);
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        authService.clearTokens();
        setUser(null);
        // Não redirecionar automaticamente, apenas limpar tokens
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [pathname]);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    login,
    loginWithGoogle,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 