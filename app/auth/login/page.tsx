'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('请填写所有必填字段');
      return;
    }

    const success = await login(formData.email, formData.password);
    
    if (success) {
      router.push('/profile');
    } else {
      setError('登录失败，请检查邮箱和密码');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <i className="fas fa-brain text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">OpenAIGC</h1>
          <p className="text-slate-600">欢迎回到AI创作平台</p>
        </div>

        {/* 登录表单 */}
        <GlassCard className="animate-bounce-in">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 邮箱输入 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <i className="fas fa-envelope text-slate-500 mr-2"></i>
                邮箱地址
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300"
                  placeholder="请输入您的邮箱"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* 密码输入 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <i className="fas fa-lock text-slate-500 mr-2"></i>
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-white/60 border border-white/40 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all duration-300 pr-12"
                  placeholder="请输入您的密码"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors"
                  disabled={isLoading}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>

            {/* 错误信息 */}
            {error && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* 登录按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  登录中...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  登录
                </div>
              )}
            </button>

            {/* 分割线 */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/50 text-slate-500">或者</span>
              </div>
            </div>

            {/* 社交登录 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors duration-300 disabled:opacity-50"
              >
                <i className="fab fa-google text-red-500 mr-2"></i>
                <span className="text-sm font-medium text-slate-700">Google</span>
              </button>
              <button
                type="button"
                disabled={isLoading}
                className="flex items-center justify-center px-4 py-3 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors duration-300 disabled:opacity-50"
              >
                <i className="fab fa-github text-slate-800 mr-2"></i>
                <span className="text-sm font-medium text-slate-700">GitHub</span>
              </button>
            </div>
          </form>
        </GlassCard>

        {/* 注册链接 */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            还没有账号？
            <Link href="/auth/register" className="text-blue-600 hover:text-blue-700 font-semibold ml-1 transition-colors">
              立即注册
            </Link>
          </p>
        </div>

        {/* 返回首页 */}
        <div className="text-center mt-4">
          <Link href="/" className="text-slate-500 hover:text-slate-700 text-sm transition-colors">
            <i className="fas fa-arrow-left mr-1"></i>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
}