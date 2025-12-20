'use client';

import { useState } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import { ProtectedRoute } from '@/components/auth';

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  workVisibility: 'public' | 'unlisted' | 'private';
  allowDataCollection: boolean;
  allowAnalytics: boolean;
  allowMarketing: boolean;
  showActivity: boolean;
  allowDownloads: boolean;
}

interface DataConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
  personalization: boolean;
}

interface ThirdPartyApp {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  connectedAt: string;
  status: 'active' | 'inactive';
}

function PrivacyContent() {
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'friends',
    workVisibility: 'unlisted',
    allowDataCollection: true,
    allowAnalytics: true,
    allowMarketing: false,
    showActivity: true,
    allowDownloads: true
  });

  const [dataConsent, setDataConsent] = useState<DataConsent>({
    essential: true,
    analytics: true,
    marketing: false,
    personalization: true
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDataExport, setShowDataExport] = useState(false);

  const thirdPartyApps: ThirdPartyApp[] = [
    {
      id: '1',
      name: 'Dropbox',
      description: '云存储服务，自动备份您的作品',
      permissions: ['读取文件', '写入文件'],
      connectedAt: '2024-10-15T10:30:00Z',
      status: 'active'
    },
    {
      id: '2',
      name: 'Google Drive',
      description: 'Google云端硬盘，跨平台文件同步',
      permissions: ['访问文件'],
      connectedAt: '2024-09-20T14:20:00Z',
      status: 'active'
    }
  ];

  const updatePrivacySetting = (key: keyof PrivacySettings, value: any) => {
    setPrivacySettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateDataConsent = (key: keyof DataConsent, value: boolean) => {
    setDataConsent(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleDisconnectApp = (appId: string) => {
    console.log('断开应用连接:', appId);
  };

  const handleExportData = () => {
    console.log('导出用户数据');
    setShowDataExport(true);
    setTimeout(() => setShowDataExport(false), 3000);
  };

  const handleDeleteData = () => {
    console.log('删除用户数据');
    setShowDeleteConfirm(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center">
            <i className="fas fa-shield-alt mr-4 text-green-500 text-3xl"></i>
            隐私权限
          </h1>
          <p className="text-slate-600">管理您的数据隐私和安全设置</p>
        </div>

        <div className="space-y-8">
          {/* 可见性设置 */}
          <GlassCard>
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <i className="fas fa-eye mr-3 text-blue-500"></i>
              可见性设置
            </h3>
            
            <div className="space-y-6">
              {/* 个人资料可见性 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  个人资料可见性
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'public', label: '公开', desc: '任何人都可以查看您的个人资料' },
                    { value: 'friends', label: '仅好友', desc: '只有您的关注者可以查看' },
                    { value: 'private', label: '私密', desc: '仅您自己可以查看' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="profileVisibility"
                        value={option.value}
                        checked={privacySettings.profileVisibility === option.value}
                        onChange={(e) => updatePrivacySetting('profileVisibility', e.target.value)}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-slate-800">{option.label}</div>
                        <div className="text-sm text-slate-600">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 作品可见性 */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  作品可见性
                </label>
                <div className="space-y-3">
                  {[
                    { value: 'public', label: '公开', desc: '所有用户都可以搜索和查看' },
                    { value: 'unlisted', label: '不公开', desc: '只有知道链接的人可以查看' },
                    { value: 'private', label: '私密', desc: '仅您自己可以查看' }
                  ].map((option) => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        name="workVisibility"
                        value={option.value}
                        checked={privacySettings.workVisibility === option.value}
                        onChange={(e) => updatePrivacySetting('workVisibility', e.target.value)}
                        className="mr-3 text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <div className="font-medium text-slate-800">{option.label}</div>
                        <div className="text-sm text-slate-600">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </GlassCard>

          {/* 活动状态 */}
          <GlassCard>
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <i className="fas fa-user-clock mr-3 text-purple-500"></i>
              活动状态
            </h3>
            
            <div className="space-y-4">
              {/* 显示在线状态 */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-800">显示在线状态</h4>
                  <p className="text-sm text-slate-600">允许其他用户看到您是否在线</p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.showActivity ? 'bg-green-500' : 'bg-slate-200'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.showActivity ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </div>

              {/* 允许下载 */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-800">允许下载作品</h4>
                  <p className="text-sm text-slate-600">其他用户是否可以下载您的作品</p>
                </div>
                <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  privacySettings.allowDownloads ? 'bg-green-500' : 'bg-slate-200'
                }`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    privacySettings.allowDownloads ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* 数据使用权限 */}
          <GlassCard>
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <i className="fas fa-database mr-3 text-orange-500"></i>
              数据使用权限
            </h3>
            
            <div className="space-y-4">
              {[
                { 
                  key: 'allowDataCollection', 
                  label: '基本数据收集', 
                  desc: '用于提供核心功能，如账户管理和内容存储',
                  required: true 
                },
                { 
                  key: 'allowAnalytics', 
                  label: '使用分析', 
                  desc: '帮助我们改进服务，了解用户行为',
                  required: false 
                },
                { 
                  key: 'allowMarketing', 
                  label: '营销通信', 
                  desc: '接收产品更新、优惠信息等营销邮件',
                  required: false 
                }
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium text-slate-800 mr-2">{item.label}</h4>
                      {item.required && (
                        <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-xs">必需</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600">{item.desc}</p>
                  </div>
                  <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    privacySettings[item.key as keyof PrivacySettings] ? 'bg-green-500' : 'bg-slate-200'
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      privacySettings[item.key as keyof PrivacySettings] ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* 第三方应用授权 */}
          <GlassCard>
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <i className="fas fa-plug mr-3 text-indigo-500"></i>
              第三方应用授权
            </h3>
            
            {thirdPartyApps.length === 0 ? (
              <div className="text-center py-8">
                <i className="fas fa-plug text-4xl text-slate-300 mb-4"></i>
                <h4 className="text-lg font-medium text-slate-600 mb-2">暂无授权应用</h4>
                <p className="text-slate-500">您尚未授权任何第三方应用访问您的数据</p>
              </div>
            ) : (
              <div className="space-y-4">
                {thirdPartyApps.map((app) => (
                  <div key={app.id} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <h4 className="font-semibold text-slate-800 mr-2">{app.name}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            app.status === 'active' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {app.status === 'active' ? '已连接' : '已断开'}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">{app.description}</p>
                        <p className="text-xs text-slate-500 mt-2">
                          连接时间：{formatDate(app.connectedAt)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDisconnectApp(app.id)}
                        className="text-red-500 hover:text-red-600 text-sm font-medium"
                      >
                        断开连接
                      </button>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-slate-700 mb-2">权限范围：</h5>
                      <div className="flex flex-wrap gap-2">
                        {app.permissions.map((permission, index) => (
                          <span key={index} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                            {permission}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </GlassCard>

          {/* 数据管理 */}
          <GlassCard>
            <h3 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
              <i className="fas fa-download mr-3 text-green-500"></i>
              数据管理
            </h3>
            
            <div className="space-y-4">
              {/* 数据导出 */}
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <div>
                  <h4 className="font-medium text-blue-800">导出我的数据</h4>
                  <p className="text-sm text-blue-600 mt-1">下载您的所有个人数据，包括作品、设置和活动记录</p>
                </div>
                <button
                  onClick={handleExportData}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  {showDataExport ? '导出中...' : '导出数据'}
                </button>
              </div>

              {/* 数据删除 */}
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
                <div>
                  <h4 className="font-medium text-red-800">删除我的数据</h4>
                  <p className="text-sm text-red-600 mt-1">永久删除您的所有个人数据，此操作不可撤销</p>
                </div>
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  删除数据
                </button>
              </div>
            </div>
          </GlassCard>

          {/* 隐私说明 */}
          <GlassCard className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center">
              <i className="fas fa-info-circle mr-3 text-green-500"></i>
              隐私保护说明
            </h3>
            
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                我们采用业界标准的安全措施保护您的个人信息。所有数据传输都经过加密存储，
                严格遵守相关隐私法律法规。
              </p>
              <p>
                您可以随时更改这些设置，我们不会在未经您同意的情况下与第三方分享您的个人信息。
                如有疑问，请查看我们的隐私政策或联系客服。
              </p>
            </div>
            
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="flex flex-wrap gap-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  <i className="fas fa-shield-alt mr-1"></i>
                  数据加密
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  <i className="fas fa-lock mr-1"></i>
                  安全存储
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  <i className="fas fa-user-check mr-1"></i>
                  用户控制
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs">
                  <i className="fas fa-balance-scale mr-1"></i>
                  合规透明
                </span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* 删除确认对话框 */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md mx-4">
              <div className="text-center">
                <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">确认删除数据？</h3>
                <p className="text-slate-600 mb-6">
                  此操作将永久删除您的所有个人数据，包括作品、历史记录等，且无法恢复。
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleDeleteData}
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    确认删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <TabBar />
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <ProtectedRoute>
      <PrivacyContent />
    </ProtectedRoute>
  );
}