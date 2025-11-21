'use client';

import { useState } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';

interface OfflineItem {
  id: string;
  title: string;
  type: 'image' | 'audio' | 'video';
  thumbnail: string;
  fileSize: string;
  downloadedAt: string;
  downloadStatus: 'completed' | 'downloading' | 'failed' | 'pending';
  progress?: number;
  quality: 'standard' | 'high' | 'ultra';
}

export default function OfflinePage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [autoSync, setAutoSync] = useState(true);
  const [downloadQuality, setDownloadQuality] = useState<'standard' | 'high' | 'ultra'>('high');
  const [storageWarning, setStorageWarning] = useState(false);

  const offlineItems: OfflineItem[] = [
    {
      id: '1',
      title: '梦幻森林夜景',
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      fileSize: '2.4 MB',
      downloadedAt: '2024-11-21T10:30:00Z',
      downloadStatus: 'completed',
      quality: 'high'
    },
    {
      id: '2',
      title: '太空音乐创想',
      type: 'audio',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      fileSize: '5.8 MB',
      downloadedAt: '2024-11-20T15:45:00Z',
      downloadStatus: 'completed',
      quality: 'ultra'
    },
    {
      id: '3',
      title: 'AI概念视频',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      fileSize: '15.2 MB',
      downloadedAt: '2024-11-20T14:20:00Z',
      downloadStatus: 'downloading',
      progress: 68,
      quality: 'high'
    },
    {
      id: '4',
      title: '抽象艺术作品',
      type: 'image',
      thumbnail: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      fileSize: '3.1 MB',
      downloadedAt: '2024-11-19T11:10:00Z',
      downloadStatus: 'failed',
      quality: 'standard'
    },
    {
      id: '5',
      title: '水下世界探索',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      fileSize: '28.7 MB',
      downloadedAt: '2024-11-18T13:20:00Z',
      downloadStatus: 'completed',
      quality: 'ultra'
    }
  ];

  const totalStorage = '128 MB';
  const usedStorage = '55.2 MB';
  const availableStorage = '72.8 MB';
  const storagePercentage = Math.round((parseFloat(usedStorage) / parseFloat(totalStorage)) * 100);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <i className="fas fa-check-circle text-green-500"></i>;
      case 'downloading':
        return <i className="fas fa-spinner fa-spin text-blue-500"></i>;
      case 'failed':
        return <i className="fas fa-exclamation-circle text-red-500"></i>;
      case 'pending':
        return <i className="fas fa-clock text-yellow-500"></i>;
      default:
        return <i className="fas fa-question-circle text-slate-400"></i>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image': return 'fas fa-image text-blue-500';
      case 'video': return 'fas fa-video text-purple-500';
      case 'audio': return 'fas fa-music text-green-500';
      default: return 'fas fa-file text-gray-500';
    }
  };

  const getQualityBadge = (quality: string) => {
    const badges = {
      'standard': { text: '标准', color: 'bg-gray-100 text-gray-700' },
      'high': { text: '高清', color: 'bg-blue-100 text-blue-700' },
      'ultra': { text: '超清', color: 'bg-purple-100 text-purple-700' }
    };
    return badges[quality as keyof typeof badges] || badges.standard;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN') + ' ' + date.toLocaleTimeString('zh-CN', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const toggleSelection = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === offlineItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(offlineItems.map(item => item.id));
    }
  };

  const handleDeleteSelected = () => {
    console.log('删除选中项目:', selectedItems);
    setSelectedItems([]);
  };

  const handleRetryDownload = (id: string) => {
    console.log('重试下载:', id);
  };

  const handleClearCache = () => {
    console.log('清理缓存');
  };

  const isSelected = (id: string) => selectedItems.includes(id);

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center">
            <i className="fas fa-download mr-4 text-indigo-500 text-3xl"></i>
            离线管理
          </h1>
          <p className="text-slate-600">管理您的离线下载内容和缓存文件</p>
        </div>

        {/* 存储空间统计 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-1">{usedStorage}</div>
            <div className="text-sm text-slate-600">已使用</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">{availableStorage}</div>
            <div className="text-sm text-slate-600">可用空间</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">
              {offlineItems.filter(item => item.downloadStatus === 'completed').length}
            </div>
            <div className="text-sm text-slate-600">离线文件</div>
          </GlassCard>
          <GlassCard className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-1">
              {offlineItems.filter(item => item.downloadStatus === 'downloading').length}
            </div>
            <div className="text-sm text-slate-600">下载中</div>
          </GlassCard>
        </div>

        {/* 存储空间条 */}
        <GlassCard className={`mb-8 ${storageWarning ? 'border-red-300 bg-red-50' : ''}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">存储空间使用</h3>
            <span className="text-sm text-slate-600">{usedStorage} / {totalStorage}</span>
          </div>
          
          <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                storagePercentage > 80 ? 'bg-red-500' : 
                storagePercentage > 60 ? 'bg-yellow-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${storagePercentage}%` }}
            ></div>
          </div>
          
          {storageWarning && (
            <div className="flex items-center text-red-600 mb-4">
              <i className="fas fa-exclamation-triangle mr-2"></i>
              <span className="text-sm">存储空间不足，建议清理部分离线文件</span>
            </div>
          )}
          
          <div className="flex gap-3">
            <button
              onClick={handleClearCache}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              <i className="fas fa-trash mr-2"></i>
              清理缓存
            </button>
            <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors">
              <i className="fas fa-expand-arrows-alt mr-2"></i>
              清理空间
            </button>
          </div>
        </GlassCard>

        {/* 同步设置 */}
        <GlassCard className="mb-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <i className="fas fa-sync mr-3 text-blue-500"></i>
            同步设置
          </h3>
          
          <div className="space-y-4">
            {/* 自动同步 */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-slate-800">自动同步</h4>
                <p className="text-sm text-slate-600">在WiFi环境下自动下载新作品</p>
              </div>
              <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                autoSync ? 'bg-green-500' : 'bg-slate-200'
              }`}>
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  autoSync ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </div>
            </div>

            {/* 下载质量 */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                默认下载质量
              </label>
              <select
                value={downloadQuality}
                onChange={(e) => setDownloadQuality(e.target.value as any)}
                className="w-full md:w-48 px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              >
                <option value="standard">标准质量</option>
                <option value="high">高清质量</option>
                <option value="ultra">超清质量</option>
              </select>
            </div>
          </div>
        </GlassCard>

        {/* 离线文件列表 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-800">
              离线文件 ({offlineItems.length})
            </h2>
            
            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleSelectAll}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  {selectedItems.length === offlineItems.length ? '取消全选' : '全选'}
                </button>
                <button
                  onClick={handleDeleteSelected}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                >
                  删除选中 ({selectedItems.length})
                </button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {offlineItems.map((item) => (
              <div key={item.id} className="group">
                <GlassCard className="hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-4">
                    {/* 选择框 */}
                    <div className="flex-shrink-0">
                      <button
                        onClick={() => toggleSelection(item.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected(item.id)
                            ? 'bg-indigo-500 border-indigo-500 text-white'
                            : 'border-slate-300 hover:border-indigo-500'
                        }`}
                      >
                        {isSelected(item.id) && <i className="fas fa-check text-xs"></i>}
                      </button>
                    </div>

                    {/* 缩略图 */}
                    <div className="flex-shrink-0">
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-1 right-1">
                          <i className={`${getTypeIcon(item.type)} bg-white/90 backdrop-blur-sm rounded p-1 text-xs`}></i>
                        </div>
                      </div>
                    </div>

                    {/* 内容信息 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold text-slate-800 truncate pr-2">{item.title}</h3>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {getStatusIcon(item.downloadStatus)}
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getQualityBadge(item.quality).color}`}>
                            {getQualityBadge(item.quality).text}
                          </span>
                        </div>
                      </div>

                      {/* 下载进度 */}
                      {item.downloadStatus === 'downloading' && item.progress && (
                        <div className="mb-2">
                          <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                            <span>下载进度</span>
                            <span>{item.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* 文件信息 */}
                      <div className="flex items-center justify-between text-sm text-slate-500">
                        <span>{item.fileSize}</span>
                        <span>{formatDate(item.downloadedAt)}</span>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex-shrink-0">
                      {item.downloadStatus === 'failed' ? (
                        <button
                          onClick={() => handleRetryDownload(item.id)}
                          className="text-orange-500 hover:text-orange-600 p-2"
                          title="重试下载"
                        >
                          <i className="fas fa-redo"></i>
                        </button>
                      ) : (
                        <button className="text-slate-400 hover:text-slate-600 p-2" title="更多操作">
                          <i className="fas fa-ellipsis-v"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              </div>
            ))}
          </div>

          {offlineItems.length === 0 && (
            <GlassCard className="text-center py-12">
              <i className="fas fa-download text-4xl text-slate-300 mb-4"></i>
              <h3 className="text-lg font-medium text-slate-600 mb-2">暂无离线文件</h3>
              <p className="text-slate-500">下载作品后即可在离线状态下查看</p>
            </GlassCard>
          )}
        </div>

        {/* 使用说明 */}
        <GlassCard className="bg-gradient-to-r from-indigo-50 to-blue-50 border-indigo-200">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
            <i className="fas fa-info-circle mr-3 text-indigo-500"></i>
            离线使用说明
          </h3>
          
          <div className="space-y-3 text-sm text-slate-600">
            <p>
              离线功能允许您在没有网络连接时查看已下载的作品。系统会自动管理存储空间，
              在存储不足时提醒您清理文件。
            </p>
            <p>
              您可以设置自动同步，在WiFi环境下自动下载新作品。建议定期清理不需要的离线文件
              以释放存储空间。
            </p>
          </div>
          
          <div className="mt-4 pt-4 border-t border-indigo-200">
            <div className="flex flex-wrap gap-2">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">
                <i className="fas fa-wifi mr-1"></i>
                WiFi自动下载
              </span>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">
                <i className="fas fa-mobile-alt mr-1"></i>
                离线查看
              </span>
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs">
                <i className="fas fa-hdd mr-1"></i>
                智能缓存
              </span>
            </div>
          </div>
        </GlassCard>
      </div>
      
      <TabBar />
    </div>
  );
}