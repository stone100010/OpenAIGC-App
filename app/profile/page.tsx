'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth';
import { useAuthorWorks } from '@/hooks/useAuthorWorks';

// 用户档案数据类型
interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  avatarData?: string;
  location: string;
  website: string;
  isPro: boolean;
  joinDate: string;
}

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

// 获取真实作品数据的Hook



function ProfileContent() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 获取用户的真实作品
  const { works: userWorks, loading: worksLoading } = useAuthorWorks(user?.id || null);

  // 获取认证头信息
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      'x-user-id': user?.id || ''
    };
  };

  // 加载用户档案数据
  const loadProfileData = async () => {
    try {
      setIsLoading(true);
      
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: getAuthHeaders()
      });

      // 检查响应状态
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        // 如果返回的是mock数据（包含mock字样），优先使用AuthContext的用户信息
        if (data.message && data.message.includes('mock') && user) {
          setProfileData({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: data.data.bio || '',
            avatar: data.data.avatar || '/20250731114736.jpg',
            avatarData: data.data.avatarData,
            location: data.data.location || '',
            website: data.data.website || '',
            isPro: user.isPro,
            joinDate: user.joinDate
          });
        } else {
          setProfileData(data.data);
        }
      } else {
        console.error('获取用户档案失败:', data.message);
        // 如果API失败，使用AuthContext中的数据作为备选
        if (user) {
          setProfileData({
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
            bio: '',
            avatar: '/20250731114736.jpg',
            location: '',
            website: '',
            isPro: user.isPro,
            joinDate: user.joinDate
          });
        }
      }
    } catch (error) {
      console.error('加载用户档案失败:', error);
      // 如果API失败，使用AuthContext中的数据作为备选
      if (user) {
        setProfileData({
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          bio: '',
          avatar: '/20250731114736.jpg',
          location: '',
          website: '',
          isPro: user.isPro,
          joinDate: user.joinDate
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    loadProfileData();
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">加载用户信息中...</p>
        </div>
      </div>
    );
  }

  // 如果没有档案数据，显示错误信息
  if (!profileData) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">加载失败</h3>
          <p className="text-slate-500 mb-4">无法获取用户信息</p>
          <button
            onClick={loadProfileData}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 用户信息卡片 */}
        <GlassCard className="mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* 头像 */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center bg-gradient-to-r from-green-500 to-teal-600">
                {profileData.avatar === 'iFlow' ? (
                  <span className="text-white text-2xl font-bold">iFlow</span>
                ) : profileData.avatarData ? (
                  <img 
                    src={profileData.avatarData} 
                    alt={`${profileData.name} 用户头像`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={profileData.avatar}
                    alt={`${profileData.name} 用户头像`}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              {profileData.isPro && (
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                  <i className="fas fa-crown text-white text-sm"></i>
                </div>
              )}
            </div>

            {/* 用户信息 */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">{profileData.name}</h2>
              <div className="flex items-center justify-center md:justify-start mb-4">
                {profileData.isPro && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold mr-3">
                    <i className="fas fa-crown mr-1"></i>
                    Pro会员
                  </span>
                )}
                <span className="text-slate-500 text-sm">加入于 {new Date(profileData.joinDate).toLocaleDateString('zh-CN')}</span>
              </div>
              
              {/* 用户简介 */}
              {profileData.bio && (
                <p className="text-slate-600 text-sm mb-4 max-w-md">
                  {profileData.bio}
                </p>
              )}
              
              {/* 位置和网站信息 */}
              <div className="space-y-2 mb-4">
                {profileData.location && (
                  <div className="flex items-center text-sm text-slate-600">
                    <i className="fas fa-map-marker-alt mr-2 text-slate-400"></i>
                    <span>{profileData.location}</span>
                  </div>
                )}
                {profileData.website && (
                  <div className="flex items-center text-sm text-slate-600">
                    <i className="fas fa-globe mr-2 text-slate-400"></i>
                    <a 
                      href={profileData.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      {profileData.website}
                    </a>
                  </div>
                )}
              </div>
              
              {/* 统计信息 */}
              <div className="grid grid-cols-3 gap-4">
                {(() => {
                  // 计算真实的统计数据
                  const totalWorks = userWorks ? userWorks.length : 0;
                  const totalLikes = userWorks ? userWorks.reduce((sum, work) => sum + (work.likesCount || 0), 0) : 0;
                  
                  // 计算使用时长：从第一个作品到现在的时间
                  let usageHours = 0;
                  if (userWorks && userWorks.length > 0) {
                    const firstWorkDate = new Date(Math.min(...userWorks.map(work => new Date(work.createdAt).getTime())));
                    const now = new Date();
                    const diffDays = Math.ceil((now.getTime() - firstWorkDate.getTime()) / (1000 * 60 * 60 * 24));
                    usageHours = Math.floor(diffDays * 0.5); // 假设每天使用0.5小时
                  }
                  
                  const stats = [
                    { 
                      label: '创作作品', 
                      value: totalWorks.toString(), 
                      icon: 'fas fa-palette' 
                    },
                    { label: '使用时长', value: `${usageHours}h`, icon: 'fas fa-clock' },
                    { label: '获得点赞', value: totalLikes.toString(), icon: 'fas fa-heart' }
                  ];
                  
                  return stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <i className={`${stat.icon} text-primary text-lg`}></i>
                      </div>
                      <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
                      <div className="text-sm text-slate-600">{stat.label}</div>
                    </div>
                  ));
                })()}
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
          
          {worksLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-square bg-slate-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          ) : userWorks && userWorks.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {userWorks.slice(0, 6).map((work, index) => (
                <div key={work.id} className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-xl shadow-md">
                    <Image
                      src={work.thumbnailUrl || work.mediaUrl}
                      alt={work.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 16vw"
                      onError={(e) => {
                        // 如果图片加载失败，显示默认图片
                        const target = e.target as HTMLImageElement;
                        target.src = '/20250731114736.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center">
                        <i className="fas fa-eye text-slate-600 text-xs"></i>
                      </div>
                    </div>
                    {/* 内容类型标识 */}
                    <div className="absolute top-2 left-2">
                      <div className="bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                        {work.contentType === 'image' && <i className="fas fa-image"></i>}
                        {work.contentType === 'video' && <i className="fas fa-video"></i>}
                        {work.contentType === 'audio' && <i className="fas fa-music"></i>}
                        {work.contentType === 'text' && <i className="fas fa-file-alt"></i>}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎨</div>
              <h4 className="text-xl font-semibold text-slate-700 mb-2">还没有作品</h4>
              <p className="text-slate-500 mb-6">开始创作你的第一个AI作品吧！</p>
              <Link href="/image-gen" className="inline-flex items-center bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors">
                <i className="fas fa-plus mr-2"></i>
                开始创作
              </Link>
            </div>
          )}
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
      
      {/* 退出登录确认对话框 */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <GlassCard className="max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">确认退出</h3>
              <p className="text-slate-600 mb-6">您确定要退出登录吗？</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  取消
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  退出
                </button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
      
      {/* Tab导航 */}
      <TabBar />
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}