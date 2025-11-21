'use client';

import { useState } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';

export default function VideoDetailPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleEdit = () => {
    alert('重新编辑作品...');
  };

  const handleDownload = () => {
    alert('下载作品...');
  };

  const handleToggleLike = () => {
    setIsLiked(!isLiked);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleShare = () => {
    alert('分享作品...');
  };

  const handleReport = () => {
    alert('举报作品...');
  };

  const videoImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=600&h=600&fit=crop';

  const relatedArtworks = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      title: '海浪视频',
      type: 'video'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      title: '未来城市',
      type: 'video'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      title: '数字艺术',
      type: 'video'
    }
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：主视频区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 主视频展示 */}
            <div className="relative glass rounded-3xl overflow-hidden group aspect-square">
              <Image
                src={videoImage}
                alt="视频预览"
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 66vw"
              />
              
              {/* 视频播放控制 */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={handlePlayPause}
                  className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
                >
                  <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-3xl ml-1`}></i>
                </button>
              </div>

              {/* 视频时长 */}
              <div className="absolute bottom-4 left-4">
                <span className="bg-black/50 text-white px-2 py-1 rounded text-sm">02:45</span>
              </div>

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
                  className="flex-[7] bg-gradient-to-r from-red-500 to-pink-600 text-white py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
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
              <h2 className="text-2xl font-bold text-slate-800 mb-3">未来城市</h2>
              <p className="text-slate-600 mb-4">AI生成 • 视频 • 2025年11月</p>
              
              {/* 统计信息 */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-red-600">1.8k</div>
                  <div className="text-sm text-slate-600">观看</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">98</div>
                  <div className="text-sm text-slate-600">点赞</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">15</div>
                  <div className="text-sm text-slate-600">收藏</div>
                </div>
              </div>

              {/* 描述 */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-2">作品描述</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  这段AI生成的视频展现了未来城市的科幻景象，充满了科技感和想象力。
                  动态的视觉效果和光影变化营造出震撼的视觉体验。
                </p>
              </div>

              {/* 标签 */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {['AI视频', '科幻', '城市', '科技', '未来'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full hover:bg-red-200 transition-colors cursor-pointer"
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
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user text-white"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">AI创作助手</h4>
                  <p className="text-sm text-slate-600">专业AI视频制作者</p>
                </div>
                <button className="text-primary hover:text-red-600 font-medium text-sm">
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
            {relatedArtworks.map((artwork) => (
              <Link key={artwork.id} href="/video-detail">
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
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <i className="fas fa-play text-white"></i>
                      </div>
                    </div>
                  </div>
                  <h4 className="text-sm font-medium text-slate-800 mt-2 group-hover:text-red-600 transition-colors">
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
