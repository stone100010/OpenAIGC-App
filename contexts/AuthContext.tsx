'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  isPro: boolean;
  joinDate: string;
  stats: {
    artworks: number;
    duration: string;
    likes: number;
  };
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

  // 检查localStorage中的登录状态
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 简单的模拟认证 - 支持用户名和邮箱两种登录方式
      if (email && password) {
        let userName = email;
        
        // 如果是邮箱格式，提取用户名部分
        if (email.includes('@')) {
          userName = email.split('@')[0];
        }
        
        const mockUser: User = {
          id: '1',
          email: email.includes('@') ? email : `${email}@openai.com`,
          name: userName,
          isPro: Math.random() > 0.5, // 随机是否为Pro用户
          joinDate: new Date().toLocaleDateString('zh-CN'),
          stats: {
            artworks: Math.floor(Math.random() * 100),
            duration: `${Math.floor(Math.random() * 200)}h`,
            likes: Math.floor(Math.random() * 2000)
          }
        };
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, password: string, inviteCode: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // 模拟API调用延迟
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      if (name && password && inviteCode) {
        const newUser: User = {
          id: Date.now().toString(),
          email: `${name}@openai.com`, // 生成临时邮箱
          name,
          isPro: false,
          joinDate: new Date().toLocaleDateString('zh-CN'),
          stats: {
            artworks: 0,
            duration: '0h',
            likes: 0
          }
        };
        
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      }
      
      return false;
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