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
        
        // 使用数据库中存在的odyssey用户ID
        const userId = 'ad57ef07-8446-472f-9fda-c0068798a2e0';
        
        const mockUser: User = {
          id: userId,
          username: 'Odyssey Warsaw',
          email: email.includes('@') ? email : `${email}@openai.com`,
          name: 'Odyssey Warsaw',
          isPro: true, // 使用数据库中的真实值
          joinDate: '2025年11月23日',
          stats: {
            artworks: 92, // 使用数据库中的真实值
            duration: '150h',
            likes: 1200
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
        // 生成UUID格式的用户ID
        const userId = generateUUID();
        
        const newUser: User = {
          id: userId,
          username: name,
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