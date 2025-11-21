'use client';

import { useState } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';

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

const mockHistory: CreationItem[] = [
  {
    id: '1',
    title: '梦幻森林夜景',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    prompt: '夜晚的梦幻森林，萤火虫飞舞，月光洒在古老的树木上',
    createdAt: '2024-11-21T10:30:00Z',
    tags: ['夜景', '森林', '神秘'],
    isLiked: true,
    isPublic: true,
    stats: { views: 156, likes: 12, downloads: 8 }
  },
  {
    id: '2',
    title: '科技未来城市',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    prompt: '未来科技城市，高楼大厦，飞行汽车，霓虹灯光',
    createdAt: '2024-11-20T15:45:00Z',
    tags: ['未来', '科技', '城市'],
    isLiked: false,
    isPublic: false,
    stats: { views: 89, likes: 6, downloads: 3 }
  },
  {
    id: '3',
    title: '太空音乐创想',
    type: 'audio',
    thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    prompt: '深空背景音乐，神秘而壮观',
    createdAt: '2024-11-19T20:15:00Z',
    duration: '3:24',
    tags: ['音乐', '太空', '神秘'],
    isLiked: true,
    isPublic: true,
    stats: { views: 234, likes: 18, downloads: 12 }
  },
  {
    id: '4',
    title: 'AI概念视频',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    prompt: '展示人工智能概念的动画视频',
    createdAt: '2024-11-18T14:20:00Z',
    duration: '0:45',
    tags: ['AI', '概念', '动画'],
    isLiked: false,
    isPublic: true,
    stats: { views: 445, likes: 32, downloads: 25 }
  },
  {
    id: '5',
    title: '抽象艺术作品',
    type: 'image',
    thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    prompt: '现代抽象艺术，色彩丰富，线条流畅',
    createdAt: '2024-11-17T11:10:00Z',
    tags: ['抽象', '艺术', '色彩'],
    isLiked: true,
    isPublic: false,
    stats: { views: 67, likes: 8, downloads: 2 }
  },
  {
    id: '6',
    title: '电子音乐节拍',
    type: 'audio',
    thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    prompt: '强劲的电子音乐，节拍感强烈',
    createdAt: '2024-11-16T16:30:00Z',
    duration: '2:58',
    tags: ['电子', '音乐', '节拍'],
    isLiked: false,
    isPublic: true,
    stats: { views: 178, likes: 15, downloads: 9 }
  },
  {
    id: '7',
    title: '文案创作灵感',
    type: 'text',
    thumbnail: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    prompt: '科技产品推广文案，简洁有力',
    createdAt: '2024-11-15T09:45:00Z',
    tags: ['文案', '科技', '推广'],
    isLiked: true,
    isPublic: false,
    stats: { views: 23, likes: 3, downloads: 1 }
  },
  {
    id: '8',
    title: '水下世界探索',
    type: 'video',
    thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    prompt: '美丽的水下世界，色彩斑斓的珊瑚礁',
    createdAt: '2024-11-14T13:20:00Z',
    duration: '1:12',
    tags: ['水下', '海洋', '自然'],
    isLiked: true,
    isPublic: true,
    stats: { views: 356, likes: 28, downloads: 18 }
  }
];

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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

  const filteredHistory = mockHistory
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

  const handleDelete = (id: string) => {
    console.log('删除作品:', id);
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

        {/* 统计概览 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">48</div>
            <div className="text-sm text-slate-600">总作品</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">12</div>
            <div className="text-sm text-slate-600">公开作品</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">156</div>
            <div className="text-sm text-slate-600">获得点赞</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">2.3k</div>
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
              共找到 {filteredHistory.length} 个作品
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
                      <h3 className="font-semibold text-slate-800 mb-2 line-clamp-1">{item.title}</h3>
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
      </div>
      
      <TabBar />
    </div>
  );
}