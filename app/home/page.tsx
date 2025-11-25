'use client';

import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

// 创作作品数据类型定义
interface CreativeWork {
  id: string;
  title: string;
  description: string;
  content_type: 'image' | 'video' | 'text' | 'audio';
  content_data?: {
    content?: string;
    aspectRatio?: string;
    duration?: string;
  };
  media_url?: string;
  thumbnail_url?: string;
  tags?: string[];
  duration?: number;
  views_count: number;
  likes_count: number;
  created_at: string;
  creator: {
    username: string;
    display_name: string;
  };
  category?: {
    name: string;
    icon: string;
    color: string;
  };
}

// API响应类型
interface ApiResponse {
  success: boolean;
  data: {
    works: CreativeWork[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      hasMore: boolean;
    };
    stats: {
      total: number;
      image: number;
      video: number;
      text: number;
      audio: number;
    };
  };
  message: string;
}

export default function HomePage() {
  const [displayedWorks, setDisplayedWorks] = useState<CreativeWork[]>([]);
  const [allWorks, setAllWorks] = useState<CreativeWork[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingError, setLoadingError] = useState<string | null>(null);

  // 加载创作作品数据
  const loadWorks = useCallback(async (offset = 0, limit = 20) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setLoadingError(null);
    
    try {
      const response = await fetch(`/api/creative-works-simple?limit=${limit}&offset=${offset}`);
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        const newWorks = data.data.works;
        
        if (offset === 0) {
          setAllWorks(newWorks);
          setDisplayedWorks(newWorks.slice(0, 8));
        } else {
          setAllWorks(prev => [...prev, ...newWorks]);
          setDisplayedWorks(prev => [...prev, ...newWorks]);
        }
        
        setHasMore(data.data.pagination.hasMore);
      } else {
        throw new Error(data.message || '获取数据失败');
      }
    } catch (error) {
      console.error('加载创作作品失败:', error);
      setLoadingError(error instanceof Error ? error.message : '加载失败');
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  // 初始加载
  useEffect(() => {
    loadWorks();
  }, []);

  // 加载更多
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    
    const currentOffset = allWorks.length;
    loadWorks(currentOffset, 20);
  }, [isLoading, hasMore, allWorks.length, loadWorks]);

  // 懒加载逻辑
  useEffect(() => {
    let isScrolling = false;
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      if (isScrolling || isLoading || !hasMore) return;
      
      isScrolling = true;
      
      requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        
        if (scrollTop + clientHeight >= scrollHeight - 1000) {
          loadMore();
        }
        
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          isScrolling = false;
        }, 100);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [loadMore, isLoading, hasMore]);

  const getAspectRatioClass = (aspectRatio?: string) => {
    switch (aspectRatio) {
      case '1:1':
        return 'aspect-square';
      case '3:4':
        return 'aspect-[3/4]';
      case '4:3':
        return 'aspect-[4/3]';
      case '16:9':
        return 'aspect-video';
      case '9:16':
        return 'aspect-[9/16]';
      default:
        return 'aspect-square';
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">创作天地</h1>
          <p className="text-slate-600 text-lg">发现无限创意可能</p>
        </div>

        {/* 错误提示 */}
        {loadingError && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">加载失败: {loadingError}</p>
            <button 
              onClick={() => loadWorks(0, 20)} 
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            >
              重新加载
            </button>
          </div>
        )}

        {/* 空状态 */}
        {!isLoading && displayedWorks.length === 0 && !loadingError && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">暂无创作作品</h3>
            <p className="text-slate-500">快来成为第一个创作者吧！</p>
          </div>
        )}

        {/* 两列瀑布流布局 */}
        {displayedWorks.length > 0 && (
          <div className="columns-2 gap-4 space-y-4">
            {displayedWorks.map((work, index) => (
              <Link 
                key={work.id}
                href={`/${
                  work.content_type === 'image' ? 'image-detail' :
                  work.content_type === 'video' ? 'video-detail' :
                  work.content_type === 'text' ? 'text-detail' :
                  work.content_type === 'audio' ? 'audio-detail' :
                  'artwork-detail'
                }?id=${work.id}`}
              >
                <div className="group glass rounded-2xl overflow-hidden relative cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl break-inside-avoid mb-4">
                  
                  {/* 图片类型卡片 */}
                  {work.content_type === 'image' && (
                    <div className={`relative w-full ${getAspectRatioClass(work.content_data?.aspectRatio)}`}>
                      <Image
                        src={work.thumbnail_url || work.media_url || '/placeholder-image.jpg'}
                        alt={work.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-lg font-semibold mb-1">{work.title}</h3>
                        <p className="text-sm opacity-90">{work.description}</p>
                      </div>
                    </div>
                  )}

                  {/* 视频类型卡片 */}
                  {work.content_type === 'video' && (
                    <div className={`relative w-full ${getAspectRatioClass(work.content_data?.aspectRatio)}`}>
                      <Image
                        src={work.thumbnail_url || work.media_url || '/placeholder-video.jpg'}
                        alt={work.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      {/* 播放按钮 */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                          <i className="fas fa-play text-white text-xl ml-1"></i>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <h3 className="text-lg font-semibold mb-1">{work.title}</h3>
                        <p className="text-sm opacity-90">{work.description}</p>
                      </div>
                    </div>
                  )}

                  {/* 文字类型卡片 */}
                  {work.content_type === 'text' && (
                    <div className="relative w-full p-6 flex flex-col justify-between bg-gradient-to-br from-purple-50 to-pink-50">
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">{work.title}</h3>
                        <p className="text-sm text-slate-600 mb-4">{work.description}</p>
                        <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">
                          {work.content_data?.content || '暂无内容'}
                        </p>
                      </div>
                      <div className="text-right mt-4">
                        <span className="text-xs text-purple-500 font-medium">点击阅读更多</span>
                      </div>
                    </div>
                  )}

                  {/* 音频类型卡片 */}
                  {work.content_type === 'audio' && (
                    <div className="relative w-full p-6 flex flex-col justify-between bg-gradient-to-br from-green-50 to-teal-50">
                      {/* 音频波形可视化 */}
                      <div className="flex items-center justify-center mb-4">
                        <div className="flex items-end space-x-1">
                          {[10, 15, 12, 18, 8, 20, 14, 9, 16, 11, 19, 13, 7, 17, 10, 12, 15, 9, 14, 11].map((height, i) => (
                            <div
                              key={i}
                              className="w-1 bg-green-400 rounded-full animate-pulse"
                              style={{
                                height: `${height}px`,
                                animationDelay: `${i * 100}ms`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-slate-800 mb-2">{work.title}</h3>
                        <p className="text-sm text-slate-600 mb-2">{work.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-green-600 font-medium">
                            {formatDuration(work.duration) || work.content_data?.duration || '未知时长'}
                          </span>
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <i className="fas fa-play text-white text-xs"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  
                  
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 加载更多指示器 */}
        {isLoading && displayedWorks.length > 0 && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <span className="ml-2 text-slate-600">加载中...</span>
          </div>
        )}

        {/* 初始加载指示器 */}
        {isLoading && displayedWorks.length === 0 && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="ml-3 text-slate-600">加载创作作品中...</span>
          </div>
        )}

        {/* 内容结束提示 */}
        {!hasMore && displayedWorks.length > 0 && (
          <div className="text-center py-8">
            <p className="text-slate-500">已显示所有 {displayedWorks.length} 个作品</p>
          </div>
        )}
      </div>
      
      {/* Tab导航 */}
      <TabBar />
    </div>
  );
}