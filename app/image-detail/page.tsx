'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';

// 作品数据类型
interface WorkData {
  id: string;
  title: string;
  description: string;
  content_type: string;
  content_data: any;
  media_url?: string;
  thumbnail_url?: string;
  tags: string[];
  duration?: number;
  views_count: number;
  likes_count: number;
  created_at: string;
  creator: {
    username: string;
    email: string;
  };
}

export default function ImageDetailPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [workData, setWorkData] = useState<WorkData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const workId = searchParams.get('id');

  // 获取作品数据
  const fetchWorkData = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/creative-works-single?id=${id}`);
      const data = await response.json();
      
      if (data.success) {
        setWorkData(data.data);
      } else {
        setError(data.message || '获取作品信息失败');
      }
    } catch (error) {
      console.error('获取作品数据失败:', error);
      setError('网络错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    if (workId) {
      fetchWorkData(workId);
    } else {
      setError('作品ID缺失');
      setIsLoading(false);
    }
  }, [workId]);

  const handleEdit = () => {
    alert('重新编辑作品...');
  };

  const handleDownload = () => {
    alert('下载作品...');
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    alert('分享作品...');
  };

  const handleReport = () => {
    alert('举报作品...');
  };

  // 生成相关作品（模拟）
  const getRelatedArtworks = () => {
    if (!workData) return [];
    
    return [
      {
        id: 1,
        src: workData.thumbnail_url || workData.media_url || '',
        title: '相关作品1',
        type: 'image'
      },
      {
        id: 2,
        src: workData.thumbnail_url || workData.media_url || '',
        title: '相关作品2',
        type: 'image'
      },
      {
        id: 3,
        src: workData.thumbnail_url || workData.media_url || '',
        title: '相关作品3',
        type: 'image'
      }
    ];
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-600">加载作品信息中...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error || !workData) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h3 className="text-xl font-semibold text-slate-700 mb-2">作品不存在</h3>
          <p className="text-slate-500 mb-4">{error || '未找到作品信息'}</p>
          <Link href="/home">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              返回首页
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：主图像区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 主图像展示 */}
            <div className="relative glass rounded-3xl overflow-hidden group aspect-square">
              <Image
                src={workData.thumbnail_url || workData.media_url || '/placeholder-image.jpg'}
                alt={workData.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />

              {/* 右下角互动按钮组 */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                {/* 收藏按钮 */}
                <button
                  onClick={handleToggleLike}
                  className={`w-10 h-10 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                    isLiked
                      ? 'bg-red-500/90 text-white shadow-lg'
                      : 'bg-white/20 hover:bg-white/40 text-white'
                  }`}
                >
                  <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-sm`}></i>
                </button>

                {/* 分享按钮 */}
                <button
                  onClick={handleShare}
                  className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
                >
                  <i className="fas fa-share text-sm"></i>
                </button>

                {/* 举报按钮 */}
                <button
                  onClick={handleReport}
                  className="w-10 h-10 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-300"
                >
                  <i className="fas fa-flag text-sm"></i>
                </button>
              </div>
            </div>

            {/* 操作按钮组 */}
            <GlassCard className="hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleEdit}
                  className="flex-[7] bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                >
                  <i className="fas fa-copy mr-2 sm:mr-3 text-sm sm:text-lg"></i>
                  <span className="text-sm sm:text-base">一键复刻</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex-[1] bg-slate-100 hover:bg-slate-200 text-slate-700 py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center"
                >
                  <i className="fas fa-download mr-0 text-sm sm:text-lg"></i>
                </button>
              </div>
            </GlassCard>
          </div>

          {/* 右侧：信息面板 */}
          <div className="space-y-6">
            {/* 作品信息 */}
            <GlassCard className="hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">{workData.title}</h2>
              <p className="text-slate-600 mb-4">
                AI生成 • {workData.content_type} • {new Date(workData.created_at).toLocaleDateString('zh-CN')}
              </p>
              
              {/* 统计信息 */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{workData.views_count}</div>
                  <div className="text-sm text-slate-600">浏览</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">{workData.likes_count}</div>
                  <div className="text-sm text-slate-600">点赞</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{Math.floor(workData.likes_count * 0.1)}</div>
                  <div className="text-sm text-slate-600">收藏</div>
                </div>
              </div>

              {/* 描述 */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-2">作品描述</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {workData.description}
                </p>
              </div>

              {/* 标签 */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {workData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full hover:bg-blue-200 transition-colors cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </GlassCard>

            {/* 创作者信息 */}
            <GlassCard className="hover:shadow-xl transition-shadow duration-300">
              <h3 className="font-semibold text-slate-800 mb-4">创作者</h3>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user text-white"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">{workData.creator.username}</h4>
                  <p className="text-sm text-slate-600">专业AI艺术家</p>
                </div>
                <button className="text-primary hover:text-blue-600 font-medium text-sm">
                  关注
                </button>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* 底部：相关作品推荐 */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">相关作品</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {getRelatedArtworks().map((artwork) => (
              <Link key={artwork.id} href={`/image-detail?id=${workData.id}`}>
                <div className="group cursor-pointer">
                  <div className="relative aspect-square overflow-hidden rounded-xl shadow-md">
                    <Image
                      src={artwork.src}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300"></div>
                  </div>
                  <h4 className="text-sm font-medium text-slate-800 mt-2 group-hover:text-blue-600 transition-colors">
                    {artwork.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tab导航 */}
      <TabBar />
    </div>
  );
}
