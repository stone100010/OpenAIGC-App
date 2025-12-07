'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
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

function TextDetailContent() {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
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

  const handleToggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
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
        title: '相关文字作品1',
        excerpt: '探索无限可能的文字世界...',
        type: 'text'
      },
      {
        id: 2,
        title: '相关文字作品2',
        excerpt: '发现生活中的美好瞬间...',
        type: 'text'
      },
      {
        id: 3,
        title: '相关文字作品3',
        excerpt: '记录思想的自由飞翔...',
        type: 'text'
      }
    ];
  };

  // 加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
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
            <button className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
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
          {/* 左侧：主内容区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 文字内容展示 */}
            <div className="glass rounded-3xl p-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">{workData.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <span className="flex items-center">
                    <i className="fas fa-calendar-alt mr-2"></i>
                    {new Date(workData.created_at).toLocaleDateString('zh-CN')}
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-file-alt mr-2"></i>
                    文字作品
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-2"></i>
                    {Math.ceil((workData.content_data?.content?.length || 0) / 500)}分钟阅读
                  </span>
                </div>
              </div>

              {/* 文字内容 */}
              <div className="prose prose-slate max-w-none">
                {(workData.content_data?.content || '').trim().split('\n\n').map((paragraph: string, index: number) => (
                  <p key={index} className="text-slate-700 leading-relaxed mb-6 text-lg">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>

              {/* 底部互动按钮 */}
              <div className="absolute bottom-6 right-6 flex space-x-2">
                {/* 收藏按钮 */}
                <button
                  onClick={handleToggleLike}
                  className={`w-10 h-10 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                    isLiked
                      ? 'bg-red-500/90 text-white shadow-lg'
                      : 'bg-white/40 hover:bg-white/60 text-slate-700'
                  }`}
                >
                  <i className={`${isLiked ? 'fas' : 'far'} fa-heart text-sm`}></i>
                </button>

                {/* 书签按钮 */}
                <button
                  onClick={handleToggleBookmark}
                  className={`w-10 h-10 rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                    isBookmarked
                      ? 'bg-yellow-500/90 text-white shadow-lg'
                      : 'bg-white/40 hover:bg-white/60 text-slate-700'
                  }`}
                >
                  <i className={`${isBookmarked ? 'fas' : 'far'} fa-bookmark text-sm`}></i>
                </button>

                {/* 分享按钮 */}
                <button
                  onClick={handleShare}
                  className="w-10 h-10 bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 transition-all duration-300"
                >
                  <i className="fas fa-share text-sm"></i>
                </button>

                {/* 举报按钮 */}
                <button
                  onClick={handleReport}
                  className="w-10 h-10 bg-white/40 hover:bg-white/60 backdrop-blur-sm rounded-full flex items-center justify-center text-slate-700 transition-all duration-300"
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
                  className="flex-[7] bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
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
              <h2 className="text-xl font-bold text-slate-800 mb-3">关于此作品</h2>
              
              {/* 统计信息 */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-purple-600">{workData.views_count}</div>
                  <div className="text-sm text-slate-600">阅读</div>
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

              {/* 作品信息 */}
              <div className="mb-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">字数</span>
                    <span className="text-slate-800 font-medium">{(workData.content_data?.content || '').length}字</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">类型</span>
                    <span className="text-slate-800 font-medium">文字作品</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">主题</span>
                    <span className="text-slate-800 font-medium">{workData.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">创作时间</span>
                    <span className="text-slate-800 font-medium">{new Date(workData.created_at).toLocaleDateString('zh-CN')}</span>
                  </div>
                </div>
              </div>

              {/* 标签 */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {workData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full hover:bg-purple-200 transition-colors cursor-pointer"
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
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user text-white"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">{workData.creator.username}</h4>
                  <p className="text-sm text-slate-600">专业AI文学家</p>
                </div>
                <button className="text-primary hover:text-purple-600 font-medium text-sm">
                  关注
                </button>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* 底部：相关作品推荐 */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">相关作品</h3>
          <div className="space-y-4">
            {getRelatedArtworks().map((artwork) => (
              <Link key={artwork.id} href={`/text-detail?id=${workData.id}`}>
                <div className="group cursor-pointer">
                  <div className="glass rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <h4 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors">
                      {artwork.title}
                    </h4>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {artwork.excerpt}
                    </p>
                    <div className="flex items-center mt-4 text-xs text-slate-500">
                      <i className="fas fa-file-alt mr-2"></i>
                      <span>文字作品</span>
                    </div>
                  </div>
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

export default function TextDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-slate-600">加载中...</div>
      </div>
    }>
      <TextDetailContent />
    </Suspense>
  );
}
