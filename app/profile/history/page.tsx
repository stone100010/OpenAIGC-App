'use client';

import { useState, useEffect } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth';

interface CreationItem {
  id: string;
  title: string;
  type: 'image' | 'audio' | 'video' | 'text';
  thumbnail: string;
  prompt: string;
  createdAt: string;
  duration?: string;
  tags: string[];
  isLiked: boolean;
  isPublic: boolean;
  stats: {
    views: number;
    likes: number;
    downloads: number;
  };
}

function HistoryContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [history, setHistory] = useState<CreationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // 从数据库加载创作历史
  useEffect(() => {
    const loadHistory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/creative-works-simple?limit=100&offset=0');
        const data = await response.json();

        if (data.success) {
          const formattedHistory: CreationItem[] = data.data.works.map((work: any) => ({
            id: work.id,
            title: work.title,
            type: work.contentType,
            thumbnail: work.thumbnailUrl || work.mediaUrl,
            prompt: work.description || '',
            createdAt: work.createdAt,
            duration: work.duration ? `${Math.floor(work.duration / 60)}:${(work.duration % 60).toString().padStart(2, '0')}` : undefined,
            tags: work.tags || [],
            isLiked: false,
            isPublic: true,
            stats: {
              views: work.viewsCount || 0,
              likes: work.likesCount || 0,
              downloads: 0
            }
          }));

          setHistory(formattedHistory);
          setTotalCount(data.data.pagination.total);
        } else {
          throw new Error(data.message || '加载失败');
        }
      } catch (err) {
        console.error('加载创作历史失败:', err);
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadHistory();
  }, []);

  const typeOptions = [
    { id: 'all', label: '全部', icon: 'fas fa-layer-group' },
    { id: 'image', label: '图像', icon: 'fas fa-image' },
    { id: 'video', label: '视频', icon: 'fas fa-video' },
    { id: 'audio', label: '音频', icon: 'fas fa-music' },
    { id: 'text', label: '文案', icon: 'fas fa-file-text' }
  ];

  const sortOptions = [
    { id: 'date', label: '按时间', icon: 'fas fa-calendar' },
    { id: 'likes', label: '按点赞', icon: 'fas fa-heart' },
    { id: 'views', label: '按浏览', icon: 'fas fa-eye' },
    { id: 'title', label: '按标题', icon: 'fas fa-sort-alpha-down' }
  ];

  const filteredHistory = history
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.prompt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || item.type === selectedType;
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'likes':
          return b.stats.likes - a.stats.likes;
        case 'views':
          return b.stats.views - a.stats.views;
        case 'title':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return 'fas fa-image text-blue-500';
      case 'video': return 'fas fa-video text-purple-500';
      case 'audio': return 'fas fa-music text-green-500';
      case 'text': return 'fas fa-file-text text-orange-500';
      default: return 'fas fa-file text-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '今天';
    if (diffDays === 2) return '昨天';
    if (diffDays <= 7) return `${diffDays}天前`;
    return date.toLocaleDateString('zh-CN');
  };

  const handleLike = (id: string) => {
    console.log('点赞作品:', id);
  };

  const handleShare = (id: string) => {
    console.log('分享作品:', id);
  };

  const handleDelete = async (id: string) => {
    // 找到要删除的作品
    const workToDelete = history.find(item => item.id === id);
    if (!workToDelete) return;

    // 显示确认对话框
    const confirmed = window.confirm(`确定要删除作品"${workToDelete.title}"吗？此操作不可撤销。`);
    if (!confirmed) return;

    try {
      // 调用删除API
      const response = await fetch(`/api/creative-works?id=${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        // 从本地状态中移除已删除的作品
        setHistory(prevHistory => prevHistory.filter(item => item.id !== id));
        
        // 显示成功提示
        alert('作品删除成功！');
      } else {
        throw new Error(data.message || '删除失败');
      }
    } catch (error) {
      console.error('删除作品失败:', error);
      alert(`删除失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center">
            <i className="fas fa-history mr-4 text-purple-500 text-3xl"></i>
            创作历史
          </h1>
          <p className="text-slate-600">查看和管理您的所有创作作品</p>
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            <span className="ml-3 text-slate-600">加载中...</span>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">加载失败: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
            >
              重新加载
            </button>
          </div>
        )}

        {!isLoading && !error && (
          <>
            {/* 统计概览 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <GlassCard className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">{totalCount}</div>
                <div className="text-sm text-slate-600">总作品</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {totalCount}
                </div>
                <div className="text-sm text-slate-600">公开作品</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {history.reduce((sum, h) => sum + h.stats.likes, 0)}
                </div>
                <div className="text-sm text-slate-600">获得点赞</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {history.reduce((sum, h) => sum + h.stats.views, 0)}
                </div>
                <div className="text-sm text-slate-600">总浏览量</div>
              </GlassCard>
            </div>

        {/* 搜索和筛选 */}
        <GlassCard className="mb-8">
          <div className="space-y-4">
            {/* 搜索框 */}
            <div className="relative">
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"></i>
              <input
                type="text"
                placeholder="搜索作品标题或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
              />
            </div>

            {/* 筛选和排序 */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* 类型筛选 */}
              <div className="flex-1">
                <label className="block text-sm font-medium text-slate-700 mb-2">作品类型</label>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        selectedType === type.id
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <i className={`${type.icon} mr-2`}></i>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 排序和视图 */}
              <div className="flex gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">排序方式</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">视图模式</label>
                  <div className="flex bg-slate-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'grid'
                          ? 'bg-white shadow-sm text-purple-600'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <i className="fas fa-th-large"></i>
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === 'list'
                          ? 'bg-white shadow-sm text-purple-600'
                          : 'text-slate-600 hover:text-slate-800'
                      }`}
                    >
                      <i className="fas fa-list"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </GlassCard>

        {/* 作品列表 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              共找到 {totalCount} 个作品
            </h2>
          </div>

          {filteredHistory.length === 0 ? (
            <GlassCard className="text-center py-12">
              <i className="fas fa-search text-4xl text-slate-300 mb-4"></i>
              <h3 className="text-lg font-medium text-slate-600 mb-2">没有找到作品</h3>
              <p className="text-slate-500">尝试调整搜索条件或筛选器</p>
            </GlassCard>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-4'
            }`}>
              {filteredHistory.map((item) => (
                <div key={item.id} className={`group ${
                  viewMode === 'list' ? 'flex gap-4 p-4' : ''
                }`}>
                  <GlassCard className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer h-full">
                    {/* 缩略图 */}
                    <div className={`relative ${
                      viewMode === 'list' ? 'w-32 h-32' : 'aspect-square'
                    } overflow-hidden rounded-xl mb-4`}>
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          // 只有当图片真正加载失败时才显示默认图片
                          const target = e.target as HTMLImageElement;
                          if (target.src !== `${window.location.origin}/20250731114736.jpg`) {
                            target.src = '/20250731114736.jpg';
                          }
                        }}
                      />
                      
                      {/* 类型标识 */}
                      <div className="absolute top-2 left-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          item.type === 'image' ? 'bg-blue-500/90' :
                          item.type === 'video' ? 'bg-purple-500/90' :
                          item.type === 'audio' ? 'bg-green-500/90' :
                          'bg-orange-500/90'
                        } backdrop-blur-sm`}>
                          <i className={`fas ${
                            item.type === 'image' ? 'fa-image' :
                            item.type === 'video' ? 'fa-video' :
                            item.type === 'audio' ? 'fa-music' :
                            'fa-file-text'
                          } text-white text-sm`}></i>
                        </div>
                      </div>

                      {/* 状态标识 */}
                      {item.isPublic && (
                        <div className="absolute top-2 right-2">
                          <div className="bg-green-500/90 backdrop-blur-sm rounded-full p-1">
                            <i className="fas fa-globe text-white text-xs"></i>
                          </div>
                        </div>
                      )}

                      {/* 播放时长 */}
                      {item.duration && (
                        <div className="absolute bottom-2 right-2">
                          <div className="bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
                            {item.duration}
                          </div>
                        </div>
                      )}

                      {/* 悬停操作 */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                          <button
                            onClick={() => handleLike(item.id)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              item.isLiked 
                                ? 'bg-red-500 text-white' 
                                : 'bg-white/90 text-slate-600 hover:bg-red-500 hover:text-white'
                            }`}
                          >
                            <i className="fas fa-heart text-sm"></i>
                          </button>
                          <button
                            onClick={() => handleShare(item.id)}
                            className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-slate-600 hover:bg-blue-500 hover:text-white transition-all"
                          >
                            <i className="fas fa-share text-sm"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-slate-600 hover:bg-red-500 hover:text-white transition-all"
                          >
                            <i className="fas fa-trash text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 内容信息 */}
                    <div className={viewMode === 'list' ? 'flex-1' : ''}>
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.prompt}</p>

                      {/* 标签 */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.tags.slice(0, 3).map((tag, index) => (
                          <span key={index} className="bg-slate-100 text-slate-600 px-2 py-1 rounded-full text-xs">
                            {tag}
                          </span>
                        ))}
                        {item.tags.length > 3 && (
                          <span className="text-slate-400 text-xs">+{item.tags.length - 3}</span>
                        )}
                      </div>

                      {/* 统计和时间 */}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <div className="flex gap-3">
                          <span><i className="fas fa-eye mr-1"></i>{item.stats.views}</span>
                          <span><i className="fas fa-heart mr-1"></i>{item.stats.likes}</span>
                          <span><i className="fas fa-download mr-1"></i>{item.stats.downloads}</span>
                        </div>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          )}
        </div>
        </>
        )}
      </div>

      <TabBar />
    </div>
  );
}

export default function HistoryPage() {
  return (
    <ProtectedRoute>
      <HistoryContent />
    </ProtectedRoute>
  );
}