'use client';

import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth';

const plans = [
  {
    id: 'free',
    name: '免费体验',
    price: '¥0',
    period: '/永久',
    description: '适合轻度体验',
    color: 'from-slate-400 to-slate-500',
    borderColor: 'border-slate-200',
    features: [
      { text: '每日3次生成', included: true },
      { text: '标清导出', included: true },
      { text: '基础模板', included: true },
      { text: '含水印导出', included: true },
      { text: '4K高清导出', included: false },
      { text: '优先队列', included: false }
    ]
  },
  {
    id: 'pro',
    name: '个人创作版',
    price: '¥19',
    period: '/月',
    description: '专业创作者首选',
    popular: true,
    color: 'from-yellow-400 to-orange-500',
    borderColor: 'border-yellow-300',
    features: [
      { text: '每月200次生成', included: true },
      { text: '高清导出', included: true },
      { text: '所有模板', included: true },
      { text: '无水印导出', included: true },
      { text: '优先队列', included: true },
      { text: 'API试用', included: true }
    ]
  },
  {
    id: 'enterprise',
    name: '专业创作版',
    price: '¥49',
    period: '/月',
    description: '专业创作重度用户',
    color: 'from-purple-500 to-indigo-600',
    borderColor: 'border-purple-200',
    features: [
      { text: '每月800次生成', included: true },
      { text: '4K高清导出', included: true },
      { text: '所有模板', included: true },
      { text: '批量处理', included: true },
      { text: 'API接口', included: true },
      { text: '专属支持', included: true }
    ]
  }
];

function SubscriptionContent() {
  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        

        {/* 当前会员状态 */}
        <GlassCard className="text-center mb-8 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <div className="flex items-center justify-center mb-6">
            <i className="fas fa-crown text-3xl text-yellow-500 mr-4"></i>
            <div>
              <h3 className="text-2xl font-bold text-slate-800">当前方案：个人创作版</h3>
              <p className="text-slate-600 mt-1">有效期至 2025年12月31日</p>
            </div>
          </div>
          
          {/* 使用统计 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-slate-600">本月已用次数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">44</div>
              <div className="text-sm text-slate-600">剩余次数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">8</div>
              <div className="text-sm text-slate-600">剩余天数</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              <i className="fas fa-sync mr-2"></i>
              立即续费
            </button>
            <button className="border border-yellow-300 text-yellow-700 px-8 py-3 rounded-xl font-semibold hover:bg-yellow-50 transition-colors">
              <i className="fas fa-cog mr-2"></i>
              管理订阅
            </button>
          </div>
        </GlassCard>

        {/* 会员计划卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <GlassCard 
              key={plan.id} 
              className={`relative hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${
                plan.popular ? `${plan.borderColor} border-2 shadow-xl` : `${plan.borderColor} border`
              }`}
            >
              {/* 当前计划标签 */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className={`bg-gradient-to-r ${plan.color} text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg`}>
                    <i className="fas fa-crown mr-1"></i>
                    当前计划
                  </div>
                </div>
              )}

              <div className="text-center pt-8">
                {/* 计划名称 */}
                <h3 className="text-2xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <p className="text-slate-600 mb-6">{plan.description}</p>

                {/* 价格 */}
                <div className="mb-8">
                  <span className="text-4xl font-bold text-slate-800">{plan.price}</span>
                  <span className="text-slate-500">{plan.period}</span>
                </div>

                {/* 功能列表 */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-left">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                        feature.included 
                          ? 'bg-emerald-100' 
                          : 'bg-slate-100'
                      }`}>
                        {feature.included ? (
                          <i className="fas fa-check text-emerald-600 text-sm"></i>
                        ) : (
                          <i className="fas fa-times text-slate-400 text-sm"></i>
                        )}
                      </div>
                      <span className={`text-sm ${
                        feature.included ? 'text-slate-700' : 'text-slate-400'
                      }`}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* 按钮 */}
                <button className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 ${
                  plan.popular
                    ? `bg-gradient-to-r ${plan.color} text-white shadow-lg hover:shadow-xl transform hover:scale-105`
                    : plan.id === 'free'
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg transform hover:scale-105'
                }`}>
                  {plan.id === 'pro' ? '当前计划' : plan.id === 'free' ? '升级计划' : '联系销售'}
                </button>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* 会员特权展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="group">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h4 className="text-lg font-bold text-blue-800 mb-3">智能创作</h4>
              <p className="text-blue-700 text-sm mb-4 leading-relaxed">个人创作版支持每月200次生成，满足日常创作需求</p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-blue-600">
                  <i className="fas fa-image mr-2"></i>
                  <span>图像生成：200次/月</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <i className="fas fa-music mr-2"></i>
                  <span>音频生成：200次/月</span>
                </div>
                <div className="flex items-center text-xs text-blue-600">
                  <i className="fas fa-video mr-2"></i>
                  <span>视频生成：200次/月</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h4 className="text-lg font-bold text-green-800 mb-3">高清无水印</h4>
              <p className="text-green-700 text-sm mb-4 leading-relaxed">支持高清导出，无水印限制，适合商业使用</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600">图像分辨率</span>
                  <span className="font-medium text-green-800">高清 (1920×1080)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600">视频分辨率</span>
                  <span className="font-medium text-green-800">1080p (1920×1080)</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-green-600">水印状态</span>
                  <span className="font-medium text-green-800">无水印</span>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <h4 className="text-lg font-bold text-purple-800 mb-3">优先服务</h4>
              <p className="text-purple-700 text-sm mb-4 leading-relaxed">享受优先队列和技术支持，提升创作效率</p>
              <div className="space-y-2">
                <div className="flex items-center text-xs text-purple-600">
                  <i className="fas fa-bolt mr-2"></i>
                  <span>生成队列优先</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <i className="fas fa-headset mr-2"></i>
                  <span>专业技术支持</span>
                </div>
                <div className="flex items-center text-xs text-purple-600">
                  <i className="fas fa-code mr-2"></i>
                  <span>API试用权限</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ部分 */}
        <GlassCard className="hover:shadow-xl transition-shadow duration-300">
          <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">会员常见问题</h3>
          <div className="space-y-6">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-slate-800 mb-2">如何查看剩余使用次数？</h4>
              <p className="text-slate-600 text-sm">您可以在上方"当前方案"卡片中查看本月已用次数和剩余次数，系统会自动统计。</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-slate-800 mb-2">月度生成次数用完了怎么办？</h4>
              <p className="text-slate-600 text-sm">当月度次数用完后，您可以选择升级到更高版本的方案，或等待下月重新获得生成次数。</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-slate-800 mb-2">如何升级到专业创作版？</h4>
              <p className="text-slate-600 text-sm">点击"专业创作版"卡片中的按钮，系统会自动将您的账号升级为800次/月方案。</p>
            </div>
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-semibold text-slate-800 mb-2">免费版和专业版有什么区别？</h4>
              <p className="text-slate-600 text-sm">免费版每日3次、含水印、标清导出；专业版每月200次、高清无水印、优先队列，更适合持续创作。</p>
            </div>
          </div>
        </GlassCard>
      </div>
      
      {/* Tab导航 */}
      <TabBar />
    </div>
  );
}

export default function SubscriptionPage() {
  return (
    <ProtectedRoute>
      <SubscriptionContent />
    </ProtectedRoute>
  );
}