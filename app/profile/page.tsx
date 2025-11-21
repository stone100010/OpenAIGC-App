'use client';

import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';

const menuItems = [
  { 
    icon: 'fas fa-cog', 
    label: '账号设置', 
    href: '/profile/settings',
    color: 'text-blue-500'
  },
  { 
    icon: 'fas fa-lock', 
    label: '隐私权限', 
    href: '/profile/privacy',
    color: 'text-green-500'
  },
  { 
    icon: 'fas fa-heart', 
    label: '我的收藏', 
    href: '/profile/favorites',
    color: 'text-red-500'
  },
  { 
    icon: 'fas fa-history', 
    label: '创作历史', 
    href: '/profile/history',
    color: 'text-purple-500'
  },
  { 
    icon: 'fas fa-download', 
    label: '离线管理', 
    href: '/profile/offline',
    color: 'text-indigo-500'
  }
];

const myArtworks = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
  'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?ixlib=rb-4.0.3&w=200&h=200&fit=crop'
];

const stats = [
  { label: '创作作品', value: '48', icon: 'fas fa-palette' },
  { label: '使用时长', value: '128h', icon: 'fas fa-clock' },
  { label: '获得点赞', value: '1.2k', icon: 'fas fa-heart' }
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 用户信息卡片 */}
        <GlassCard className="mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* 头像 */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                <Image
                  src="/20250731114736.jpg"
                  alt="Odyssey Warsaw 用户头像"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <i className="fas fa-crown text-white text-sm"></i>
              </div>
            </div>

            {/* 用户信息 */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Odyssey Warsaw</h2>
              <div className="flex items-center justify-center md:justify-start mb-4">
                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold mr-3">
                  <i className="fas fa-crown mr-1"></i>
                  Pro会员
                </span>
                <span className="text-slate-500 text-sm">加入于 2025年9月</span>
              </div>
              
              {/* 统计信息 */}
              <div className="grid grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <i className={`${stat.icon} text-primary text-lg`}></i>
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 菜单列表 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-8">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <GlassCard padding="sm" className="hover:shadow-lg transition-all duration-300 group cursor-pointer transform hover:scale-105">
                <div className="flex items-center py-1">
                  <div className={`w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform`}>
                    <i className={`${item.icon} ${item.color} text-xs`}></i>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-medium text-slate-800 group-hover:text-primary transition-colors">
                      {item.label}
                    </h3>
                  </div>
                  <i className="fas fa-chevron-right text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all text-xs"></i>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>

        {/* 我的作品 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800">我的作品</h3>
            <Link href="/profile/history" className="text-primary hover:text-blue-600 font-medium">
              查看全部
              <i className="fas fa-arrow-right ml-1"></i>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {myArtworks.map((src, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden rounded-xl shadow-md">
                  <Image
                    src={src}
                    alt={`作品 ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                      <i className="fas fa-eye text-slate-600 text-sm"></i>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 会员升级卡片 */}
        <GlassCard className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-xl transition-shadow duration-300">
          <div className="text-center">
            <i className="fas fa-crown text-4xl text-yellow-500 mb-4"></i>
            <h3 className="text-xl font-bold text-slate-800 mb-2">升级到高级会员</h3>
            <p className="text-slate-600 mb-6">解锁更多AI创作功能和优先处理</p>
            <Link href="/subscription" className="inline-flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold px-8 py-3 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-300">
              <span>立即升级</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </GlassCard>
      </div>
      
      {/* Tab导航 */}
      <TabBar />
    </div>
  );
}