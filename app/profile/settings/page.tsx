'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  timezone: string;
  language: string;
  theme: string;
  isPro: boolean;
  joinDate: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  twoFactorEnabled: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  weeklyReport: boolean;
  newFeatures: boolean;
}

interface Preferences {
  language: string;
  theme: string;
  autoSave: boolean;
  highQualityExport: boolean;
  showTutorials: boolean;
}

function SettingsContent() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<UserProfile>({
    id: '',
    name: '',
    username: '',
    email: '',
    bio: '',
    avatar: '/20250731114736.jpg',
    timezone: 'UTC',
    language: 'zh-CN',
    theme: 'light',
    isPro: false,
    joinDate: ''
  });

  const [security, setSecurity] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    weeklyReport: true,
    newFeatures: true
  });

  const [preferences, setPreferences] = useState<Preferences>({
    language: 'zh-CN',
    theme: 'auto',
    autoSave: true,
    highQualityExport: true,
    showTutorials: true
  });

  // 获取认证头信息
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-user-id': user?.id || '1' // 临时使用固定ID，实际应该从认证token获取
    };
  };

  // 加载用户档案数据
  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setProfile(data.data);
      } else {
        setError(data.message || '加载用户档案失败');
      }
    } catch (error) {
      console.error('加载用户档案失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 加载用户偏好设置
  const loadPreferences = async () => {
    try {
      const response = await fetch('/api/user/preferences', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      const data = await response.json();

      if (data.success) {
        setNotifications({
          emailNotifications: data.data.emailNotifications,
          pushNotifications: data.data.pushNotifications,
          marketingEmails: data.data.marketingEmails,
          weeklyReport: data.data.weeklyReport,
          newFeatures: data.data.newFeatures
        });

        setPreferences({
          language: data.data.language,
          theme: data.data.theme,
          autoSave: data.data.autoSave,
          highQualityExport: data.data.highQualityExport,
          showTutorials: data.data.showTutorials
        });
      }
    } catch (error) {
      console.error('加载偏好设置失败:', error);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    if (user) {
      loadProfileData();
      loadPreferences();
    }
  }, [user]);

  // 保存用户档案
  const saveProfile = async () => {
    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: profile.name,
          bio: profile.bio,
          avatar: profile.avatar,
          timezone: profile.timezone,
          language: profile.language,
          theme: profile.theme
        })
      });

      const data = await response.json();

      if (data.success) {
        setIsEditing(false);
        setProfile(data.data);
      } else {
        setError(data.message || '保存失败');
      }
    } catch (error) {
      console.error('保存用户档案失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  // 保存偏好设置
  const savePreferences = async () => {
    try {
      setIsSaving(true);

      const response = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...notifications,
          ...preferences
        })
      });

      const data = await response.json();

      if (data.success) {
        console.log('偏好设置保存成功');
      }
    } catch (error) {
      console.error('保存偏好设置失败:', error);
      setError('保存偏好设置失败');
    } finally {
      setIsSaving(false);
    }
  };

  // 修改密码
  const changePassword = async () => {
    if (security.newPassword !== security.confirmPassword) {
      setError('新密码与确认密码不匹配');
      return;
    }

    if (security.newPassword.length < 6) {
      setError('新密码长度至少6位');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      const response = await fetch('/api/user/security', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          currentPassword: security.currentPassword,
          newPassword: security.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setSecurity({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
          twoFactorEnabled: security.twoFactorEnabled
        });
        alert('密码修改成功');
      } else {
        setError(data.message || '密码修改失败');
      }
    } catch (error) {
      console.error('修改密码失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', label: '个人信息', icon: 'fas fa-user' },
    { id: 'security', label: '账户安全', icon: 'fas fa-shield-alt' },
    { id: 'notifications', label: '通知设置', icon: 'fas fa-bell' },
    { id: 'preferences', label: '偏好设置', icon: 'fas fa-cog' },
    { id: 'account', label: '账号管理', icon: 'fas fa-user-cog' }
  ];

  const handleSave = async () => {
    if (activeTab === 'profile') {
      await saveProfile();
    } else if (activeTab === 'preferences' || activeTab === 'notifications') {
      await savePreferences();
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      {/* 头像编辑 */}
      <GlassCard className="text-center">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={profile.avatar}
              alt="用户头像"
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white hover:bg-primary/80 transition-colors">
            <i className="fas fa-camera text-sm"></i>
          </button>
        </div>
        <p className="text-sm text-slate-600 mt-2">点击更换头像</p>
      </GlassCard>

      {/* 基本信息 */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">昵称</label>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">邮箱地址</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({...profile, email: e.target.value})}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">个人简介</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({...profile, bio: e.target.value})}
            disabled={!isEditing}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-slate-50 disabled:text-slate-500 resize-none"
            placeholder="介绍一下自己..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">时区</label>
            <select
              value={profile.timezone}
              onChange={(e) => setProfile({...profile, timezone: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="UTC">UTC</option>
              <option value="Asia/Shanghai">中国标准时间 (UTC+8)</option>
              <option value="America/New_York">东部时间 (UTC-5)</option>
              <option value="Europe/London">格林威治时间 (UTC+0)</option>
              <option value="Asia/Tokyo">日本标准时间 (UTC+9)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">语言</label>
            <select
              value={profile.language}
              onChange={(e) => setProfile({...profile, language: e.target.value})}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:bg-slate-50 disabled:text-slate-500"
            >
              <option value="zh-CN">简体中文</option>
              <option value="en-US">English</option>
              <option value="ja-JP">日本語</option>
              <option value="ko-KR">한국어</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      {/* 修改密码 */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">修改密码</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">当前密码</label>
            <input
              type="password"
              value={security.currentPassword}
              onChange={(e) => setSecurity({...security, currentPassword: e.target.value})}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">新密码</label>
            <input
              type="password"
              value={security.newPassword}
              onChange={(e) => setSecurity({...security, newPassword: e.target.value})}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">确认新密码</label>
            <input
              type="password"
              value={security.confirmPassword}
              onChange={(e) => setSecurity({...security, confirmPassword: e.target.value})}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <button 
            onClick={changePassword}
            disabled={isSaving || !security.currentPassword || !security.newPassword || !security.confirmPassword}
            className="w-full bg-gradient-to-r from-primary to-primary/80 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? '更新中...' : '更新密码'}
          </button>
        </div>
      </GlassCard>

      {/* 两步验证 */}
      <GlassCard>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 mb-1">两步验证</h3>
            <p className="text-sm text-slate-600">为您的账户添加额外的安全保护</p>
          </div>
          <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            security.twoFactorEnabled ? 'bg-primary' : 'bg-slate-200'
          }`}>
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              security.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
            }`} />
          </div>
        </div>
      </GlassCard>

      {/* 登录历史 */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">最近登录</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-laptop text-green-600 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Chrome 浏览器</p>
                <p className="text-xs text-slate-600">北京，中国 - 当前设备</p>
              </div>
            </div>
            <span className="text-xs text-slate-500">今天 10:30</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-mobile-alt text-blue-600 text-sm"></i>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">iPhone App</p>
                <p className="text-xs text-slate-600">北京，中国</p>
              </div>
            </div>
            <span className="text-xs text-slate-500">昨天 18:45</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      {[
        { key: 'emailNotifications', label: '邮件通知', desc: '接收账户相关的邮件通知', icon: 'fas fa-envelope' },
        { key: 'pushNotifications', label: '推送通知', desc: '在设备上接收实时通知', icon: 'fas fa-mobile-alt' },
        { key: 'marketingEmails', label: '营销邮件', desc: '接收产品更新和优惠信息', icon: 'fas fa-bullhorn' },
        { key: 'weeklyReport', label: '周报邮件', desc: '每周接收您的创作统计报告', icon: 'fas fa-chart-bar' },
        { key: 'newFeatures', label: '新功能通知', desc: '第一时间了解平台新功能', icon: 'fas fa-star' }
      ].map((item) => (
        <GlassCard key={item.key}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mr-4">
                <i className={`${item.icon} text-primary`}></i>
              </div>
              <div>
                <h3 className="font-medium text-slate-800">{item.label}</h3>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            </div>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              notifications[item.key as keyof NotificationSettings] ? 'bg-primary' : 'bg-slate-200'
            }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                notifications[item.key as keyof NotificationSettings] ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );

  const renderPreferencesTab = () => (
    <div className="space-y-6">
      {/* 语言设置 */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">语言</h3>
        <select 
          value={preferences.language}
          onChange={(e) => setPreferences({...preferences, language: e.target.value})}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
        >
          <option value="zh-CN">简体中文</option>
          <option value="en-US">English</option>
          <option value="ja-JP">日本語</option>
          <option value="ko-KR">한국어</option>
        </select>
      </GlassCard>

      {/* 主题设置 */}
      <GlassCard>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">主题</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'light', label: '浅色', icon: 'fas fa-sun' },
            { value: 'dark', label: '深色', icon: 'fas fa-moon' },
            { value: 'auto', label: '自动', icon: 'fas fa-desktop' }
          ].map((theme) => (
            <button
              key={theme.value}
              onClick={() => setPreferences({...preferences, theme: theme.value})}
              className={`p-4 rounded-xl border-2 transition-all ${
                preferences.theme === theme.value 
                  ? 'border-primary bg-primary/5' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <i className={`${theme.icon} text-lg mb-2 text-slate-600`}></i>
              <p className="text-sm font-medium text-slate-700">{theme.label}</p>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* 其他偏好 */}
      {[
        { key: 'autoSave', label: '自动保存', desc: '创作过程中自动保存草稿' },
        { key: 'highQualityExport', label: '高质量导出', desc: '默认使用最高质量进行导出' },
        { key: 'showTutorials', label: '显示引导', desc: '新功能使用指导和提示' }
      ].map((item) => (
        <GlassCard key={item.key}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-slate-800">{item.label}</h3>
              <p className="text-sm text-slate-600">{item.desc}</p>
            </div>
            <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              preferences[item.key as keyof Preferences] ? 'bg-primary' : 'bg-slate-200'
            }`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                preferences[item.key as keyof Preferences] ? 'translate-x-6' : 'translate-x-1'
              }`} />
            </div>
          </div>
        </GlassCard>
      ))}
    </div>
  );

  const renderAccountTab = () => (
    <div className="space-y-6">
      {/* 账户状态 */}
      <GlassCard className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="text-center">
          <i className="fas fa-crown text-3xl text-yellow-500 mb-3"></i>
          <h3 className="text-lg font-semibold text-slate-800 mb-2">Pro会员</h3>
          <p className="text-sm text-slate-600 mb-4">有效期至 2025年12月31日</p>
          <Link href="/subscription" className="inline-flex items-center text-primary hover:text-primary/80 font-medium">
            管理订阅
            <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </div>
      </GlassCard>

      {/* 数据导出 */}
      <GlassCard>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-slate-800">导出我的数据</h3>
            <p className="text-sm text-slate-600">下载您的所有创作和设置数据</p>
          </div>
          <button className="text-primary hover:text-primary/80 font-medium">
            导出
          </button>
        </div>
      </GlassCard>

      {/* 退出登录 */}
      <GlassCard className="border-orange-200">
        <div className="text-center">
          <i className="fas fa-sign-out-alt text-2xl text-orange-500 mb-3"></i>
          <h3 className="text-lg font-semibold text-orange-600 mb-2">退出登录</h3>
          <p className="text-sm text-slate-600 mb-4">退出当前账号，返回登录页面</p>
          <button
            onClick={() => {
              if (confirm('确定要退出登录吗？')) {
                logout();
                router.push('/');
              }
            }}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-orange-600 transition-colors"
          >
            退出登录
          </button>
        </div>
      </GlassCard>

      {/* 注销账号 */}
      <GlassCard className="border-red-200">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-2xl text-red-500 mb-3"></i>
          <h3 className="text-lg font-semibold text-red-600 mb-2">注销账号</h3>
          <p className="text-sm text-slate-600 mb-4">此操作不可恢复，将永久删除您的所有数据</p>
          <button className="bg-red-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-600 transition-colors">
            注销账号
          </button>
        </div>
      </GlassCard>
    </div>
  );

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">加载设置中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 错误提示 */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
              <span className="text-red-700">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          </div>
        )}
        {/* 页面标题和操作 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-2">账号设置</h1>
              <p className="text-slate-600">管理您的个人信息和账户偏好</p>
            </div>
            <div className="flex gap-3">
              {activeTab === 'profile' && (
                <>
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                        className="px-6 py-2 text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
                      >
                        取消
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? '保存中...' : '保存'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      编辑
                    </button>
                  )}
                </>
              )}
              
              {(activeTab === 'preferences' || activeTab === 'notifications') && (
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSaving ? '保存中...' : '保存设置'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 标签导航 */}
        <div className="flex space-x-1 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>

        {/* 内容区域 */}
        <div>
          {activeTab === 'profile' && renderProfileTab()}
          {activeTab === 'security' && renderSecurityTab()}
          {activeTab === 'notifications' && renderNotificationsTab()}
          {activeTab === 'preferences' && renderPreferencesTab()}
          {activeTab === 'account' && renderAccountTab()}
        </div>
      </div>
      
      <TabBar />
    </div>
  );
}

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}