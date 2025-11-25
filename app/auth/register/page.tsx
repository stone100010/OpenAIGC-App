'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    inviteCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '请输入用户名';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = '用户名至少需要2个字符';
    }

    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少需要6个字符';
    }

    if (!formData.inviteCode.trim()) {
      newErrors.inviteCode = '请输入邀请码';
    } else if (formData.inviteCode.trim().length < 4) {
      newErrors.inviteCode = '邀请码格式不正确';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const success = await register(formData.name, formData.password, formData.inviteCode);
    
    if (success) {
      router.push('/profile');
    } else {
      setErrors({ general: '注册失败，请重试' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo和标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full mb-4 shadow-lg">
            <i className="fas fa-user-plus text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">创建账号</h1>
          <p className="text-slate-600">加入OpenAIGC，开始AI创作之旅</p>
        </div>

        {/* 注册表单 */}
        <GlassCard className="animate-bounce-in">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 用户名输入 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <i className="fas fa-user text-slate-500 mr-2"></i>
                用户名
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 ${
                    errors.name ? 'border-red-300' : 'border-white/40'
                  }`}
                  placeholder="请输入用户名"
                  disabled={isLoading}
                />
              </div>
              {errors.name && (
                <p className="text-red-600 text-xs flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.name}
                </p>
              )}
            </div>

            {/* 邀请码输入 */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center">
                <i className="fas fa-key text-slate-500 mr-2"></i>
                邀请码
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="inviteCode"
                  value={formData.inviteCode}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 ${
                    errors.inviteCode ? 'border-red-300' : 'border-white/40'
                  }`}
                  placeholder="请输入邀请码"
                  disabled={isLoading}
                />
              </div>
              <p className="text-xs text-slate-500">
                <i className="fas fa-info-circle mr-1"></i>
                暂无邀请码？请联系管理员获取
              </p>
              {errors.inviteCode && (
                <p className="text-red-600 text-xs flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.inviteCode}
                </p>
              )}
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
                  className={`w-full px-4 py-3 bg-white/60 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-transparent transition-all duration-300 pr-12 ${
                    errors.password ? 'border-red-300' : 'border-white/40'
                  }`}
                  placeholder="请输入密码（至少6位）"
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
              {errors.password && (
                <p className="text-red-600 text-xs flex items-center">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.password}
                </p>
              )}
            </div>

            

            {/* 通用错误信息 */}
            {errors.general && (
              <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <i className="fas fa-exclamation-circle mr-2"></i>
                <span className="text-sm">{errors.general}</span>
              </div>
            )}

            {/* 注册按钮 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  注册中...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <i className="fas fa-user-plus mr-2"></i>
                  注册
                </div>
              )}
            </button>

            {/* 服务条款 */}
            <div className="text-center">
              <p className="text-xs text-slate-500">
                点击"注册"即表示您同意我们的
                <Link href="/terms" className="text-green-600 hover:text-green-700 mx-1">服务条款</Link>
                和
                <Link href="/privacy" className="text-green-600 hover:text-green-700 mx-1">隐私政策</Link>
              </p>
            </div>
          </form>
        </GlassCard>

        {/* 登录链接 */}
        <div className="text-center mt-6">
          <p className="text-slate-600">
            已有账号？
            <Link href="/auth/login" className="text-green-600 hover:text-green-700 font-semibold ml-1 transition-colors">
              立即登录
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