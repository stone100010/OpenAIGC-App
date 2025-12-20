'use client';

import { useState, useEffect } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth';

interface FavoriteItem {
  id: string;
  title: string;
  type: 'image' | 'audio' | 'video' | 'text';
  thumbnail: string;
  prompt: string;
  author: string;
  createdAt: string;
  duration?: string;
  tags: string[];
  stats: {
    views: number;
    likes: number;
    downloads: number;
  };
  originalUrl?: string;
}

function FavoritesContent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // 从数据库加载收藏作品
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('/api/creative-works-simple?limit=100&offset=0');
        const data = await response.json();

        if (data.success) {
          const formattedFavorites: FavoriteItem[] = data.data.works.map((work: any) => ({
            id: work.id,
            title: work.title,
            type: work.contentType,
            thumbnail: work.thumbnailUrl || work.mediaUrl,
            prompt: work.description || '',
            author: work.creator?.displayName || work.creator?.username || '未知作者',
            createdAt: work.createdAt,
            duration: work.duration ? `${Math.floor(work.duration / 60)}:${(work.duration % 60).toString().padStart(2, '0')}` : undefined,
            tags: work.tags || [],
            stats: {
              views: work.viewsCount || 0,
              likes: work.likesCount || 0,
              downloads: 0
            }
          }));

          setFavorites(formattedFavorites);
          setTotalCount(data.data.pagination.total);
        } else {
          throw new Error(data.message || '加载失败');
        }
      } catch (err) {
        console.error('加载收藏作品失败:', err);
        setError(err instanceof Error ? err.message : '加载失败');
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const typeOptions = [
    { id: 'all', label: '全部', icon: 'fas fa-layer-group' },
    { id: 'image', label: '图像', icon: 'fas fa-image' },
    { id: 'video', label: '视频', icon: 'fas fa-video' },
    { id: 'audio', label: '音频', icon: 'fas fa-music' },
    { id: 'text', label: '文案', icon: 'fas fa-file-text' }
  ];

  const filteredFavorites = favorites
    .filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.author.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'all' || item.type === selectedType;
      return matchesSearch && matchesType;
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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image': return 'from-blue-500 to-blue-600';
      case 'video': return 'from-purple-500 to-purple-600';
      case 'audio': return 'from-green-500 to-green-600';
      case 'text': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
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

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleUnfavorite = (id: string) => {
    console.log('取消收藏:', id);
  };

  const handleBatchUnfavorite = () => {
    console.log('批量取消收藏:', selectedItems);
    setSelectedItems([]);
    setIsSelectionMode(false);
  };

  const handleShare = (item: FavoriteItem) => {
    console.log('分享收藏:', item);
  };

  const handleDownload = (item: FavoriteItem) => {
    console.log('下载收藏:', item);
  };

  const isSelected = (id: string) => selectedItems.includes(id);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center">
            <i className="fas fa-heart mr-4 text-red-500 text-3xl"></i>
            我的收藏
          </h1>
          <p className="text-slate-600">管理和查看您收藏的精彩作品</p>
        </div>

        {/* 加载状态 */}
        {isLoading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <span className="ml-3 text-slate-600">加载中...</span>
          </div>
        )}

        {/* 错误状态 */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">加载失败: {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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
                <div className="text-2xl font-bold text-red-600 mb-1">{favorites.length}</div>
                <div className="text-sm text-slate-600">总收藏</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {favorites.filter(f => f.type === 'image').length}
                </div>
                <div className="text-sm text-slate-600">图像收藏</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {favorites.filter(f => f.type === 'audio').length}
                </div>
                <div className="text-sm text-slate-600">音频收藏</div>
              </GlassCard>
              <GlassCard className="text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {favorites.filter(f => f.type === 'video').length}
                </div>
                <div className="text-sm text-slate-600">视频收藏</div>
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
                placeholder="搜索收藏作品标题、描述或作者..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-red-500/30 transition-all"
              />
            </div>

            {/* 类型筛选和批量操作 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
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
                          ? 'bg-red-500 text-white shadow-md'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <i className={`${type.icon} mr-2`}></i>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 批量操作 */}
              {selectedItems.length > 0 && (
                <div className="flex items-end">
                  <button
                    onClick={handleBatchUnfavorite}
                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <i className="fas fa-heart-broken mr-2"></i>
                    取消收藏 ({selectedItems.length})
                  </button>
                </div>
              )}
            </div>
          </div>
        </GlassCard>

        {/* 作品列表 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              共收藏 {totalCount} 个作品
            </h2>
            
            {/* 选择模式切换 */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsSelectionMode(!isSelectionMode)}
                className={`flex items-center px-4 py-2 rounded-lg transition-all ${
                  isSelectionMode
                    ? 'bg-red-500 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <i className="fas fa-check-square mr-2"></i>
                {isSelectionMode ? '退出选择' : '选择模式'}
              </button>
            </div>
          </div>

          {filteredFavorites.length === 0 ? (
            <GlassCard className="text-center py-12">
              <i className="fas fa-heart text-4xl text-slate-300 mb-4"></i>
              <h3 className="text-lg font-medium text-slate-600 mb-2">暂无收藏作品</h3>
              <p className="text-slate-500">去发现更多精彩作品并收藏它们吧！</p>
              <Link href="/tools" className="inline-flex items-center mt-4 text-red-500 hover:text-red-600 font-medium">
                去探索
                <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredFavorites.map((item) => (
                <div key={item.id} className="group">
                  <GlassCard className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    {/* 缩略图 */}
                    <div className="relative aspect-square overflow-hidden rounded-xl mb-4">
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
                      
                      {/* 选择框 */}
                      {isSelectionMode && (
                        <div className="absolute top-2 left-2">
                          <button
                            onClick={() => toggleSelection(item.id)}
                            className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                              isSelected(item.id)
                                ? 'bg-red-500 border-red-500 text-white'
                                : 'border-white bg-white/70 backdrop-blur-sm hover:border-red-500'
                            }`}
                          >
                            {isSelected(item.id) && <i className="fas fa-check text-xs"></i>}
                          </button>
                        </div>
                      )}

                      {/* 类型标识 */}
                      <div className="absolute top-2 right-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${getTypeColor(item.type)} backdrop-blur-sm`}>
                          <i className={`fas ${
                            item.type === 'image' ? 'fa-image' :
                            item.type === 'video' ? 'fa-video' :
                            item.type === 'audio' ? 'fa-music' :
                            'fa-file-text'
                          } text-white text-sm`}></i>
                        </div>
                      </div>

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
                            onClick={() => handleUnfavorite(item.id)}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-red-500 text-white hover:bg-red-600 transition-all"
                            title="取消收藏"
                          >
                            <i className="fas fa-heart-broken text-sm"></i>
                          </button>
                          <button
                            onClick={() => handleDownload(item)}
                            className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-slate-600 hover:bg-blue-500 hover:text-white transition-all"
                            title="下载"
                          >
                            <i className="fas fa-download text-sm"></i>
                          </button>
                          <button
                            onClick={() => handleShare(item)}
                            className="w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-slate-600 hover:bg-green-500 hover:text-white transition-all"
                            title="分享"
                          >
                            <i className="fas fa-share text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* 内容信息 */}
                    <div className="flex-1">
                      <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.prompt}</p>
                      
                      {/* 作者和标签 */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-slate-500">by {item.author}</span>
                      </div>
                      
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

        {/* 提示信息 */}
        <GlassCard className="bg-gradient-to-r from-red-50 to-pink-50 border-red-200">
          <div className="text-center">
            <i className="fas fa-lightbulb text-3xl text-red-500 mb-3"></i>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">收藏小贴士</h3>
            <p className="text-slate-600 mb-4 leading-relaxed">
              收藏您喜欢的作品，方便随时查看。您可以在批量操作中一次性管理多个收藏作品。
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                <i className="fas fa-heart mr-1"></i>
                快速收藏
              </span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                <i className="fas fa-search mr-1"></i>
                精准搜索
              </span>
              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm">
                <i className="fas fa-layer-group mr-1"></i>
                类型筛选
              </span>
            </div>
          </div>
        </GlassCard>
        </>
        )}
      </div>

      <TabBar />
    </div>
  );
}

export default function FavoritesPage() {
  return (
    <ProtectedRoute>
      <FavoritesContent />
    </ProtectedRoute>
  );
}