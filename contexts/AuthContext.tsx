'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  avatar?: string;
  isPro: boolean;
  joinDate: string;
  stats: {
    artworks: number;
    duration: string;
    likes: number;
  };
}

// 生成UUID v4格式的函数
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, password: string, inviteCode: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查localStorage中的登录状态（只在组件挂载时执行一次）
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) return false;
    
    setIsLoading(true);
    
    try {
      // 立即创建用户数据，不使用延迟
      const userId = 'ad57ef07-8446-472f-9fda-c0068798a2e0';
      
      const mockUser: User = {
        id: userId,
        username: 'Odyssey Warsaw',
        email: email.includes('@') ? email : `${email}@openai.com`,
        name: 'Odyssey Warsaw',
        isPro: true,
        joinDate: '2025年11月23日',
        stats: {
          artworks: 92,
          duration: '150h',
          likes: 1200
        }
      };
      
      localStorage.setItem('user', JSON.stringify(mockUser));
      setUser(mockUser);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, password: string, inviteCode: string): Promise<boolean> => {
    if (!name || !password || !inviteCode) return false;
    
    setIsLoading(true);
    
    try {
      // 立即创建用户数据，不使用延迟
      const userId = generateUUID();
      
      const newUser: User = {
        id: userId,
        username: name,
        email: `${name}@openai.com`,
        name,
        avatar: 'iFlow',
        isPro: false,
        joinDate: new Date().toLocaleDateString('zh-CN'),
        stats: {
          artworks: 0,
          duration: '0h',
          likes: 0
        }
      };
      
      localStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      return true;
    } catch (error) {
      console.error('Register error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout
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