'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';

export default function AudioDetailPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('01:23');
  const [duration, setDuration] = useState('05:32');

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

  const relatedArtworks = [
    {
      id: 1,
      title: '电子音乐',
      duration: '03:45',
      type: 'audio'
    },
    {
      id: 2,
      title: '自然之声',
      duration: '05:32',
      type: 'audio'
    },
    {
      id: 3,
      title: '氛围音乐',
      duration: '04:18',
      type: 'audio'
    }
  ];

  

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：主音频区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 主音频展示 */}
            <div className="glass rounded-3xl p-8 bg-gradient-to-br from-green-50 to-teal-50 relative">
              {/* 音频信息头部 */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">自然之声</h1>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <span className="flex items-center">
                    <i className="fas fa-music mr-2"></i>
                    音频作品
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-2"></i>
                    5:32
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-calendar-alt mr-2"></i>
                    2025年11月
                  </span>
                </div>
              </div>

              {/* 音频播放控制 */}
              <div className="mb-8">
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <button className="w-12 h-12 rounded-full bg-green-500/20 hover:bg-green-500/30 flex items-center justify-center transition-colors">
                    <i className="fas fa-step-backward text-green-600"></i>
                  </button>
                  <button
                    onClick={handlePlayPause}
                    className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors shadow-lg"
                  >
                    <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-xl ml-1`}></i>
                  </button>
                  <button className="w-12 h-12 rounded-full bg-green-500/20 hover:bg-green-500/30 flex items-center justify-center transition-colors">
                    <i className="fas fa-step-forward text-green-600"></i>
                  </button>
                </div>

                {/* 进度条 */}
                <div className="space-y-2">
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{width: '23%'}}></div>
                  </div>
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{currentTime}</span>
                    <span>{duration}</span>
                  </div>
                </div>
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
                  className="flex-[7] bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 sm:py-4 px-2 sm:px-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
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
                  <div className="text-2xl font-bold text-green-600">1.5k</div>
                  <div className="text-sm text-slate-600">播放</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">89</div>
                  <div className="text-sm text-slate-600">点赞</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">28</div>
                  <div className="text-sm text-slate-600">收藏</div>
                </div>
              </div>

              {/* 作品信息 */}
              <div className="mb-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">时长</span>
                    <span className="text-slate-800 font-medium">5分32秒</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">类型</span>
                    <span className="text-slate-800 font-medium">自然音乐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">风格</span>
                    <span className="text-slate-800 font-medium">氛围音乐</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">创作时间</span>
                    <span className="text-slate-800 font-medium">2025年11月</span>
                  </div>
                </div>
              </div>

              {/* 描述 */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-2">作品描述</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  这段AI生成的音频作品融合了森林鸟鸣与溪流声，营造出宁静自然的环境氛围。
                  适合放松、冥想或工作时的背景音乐。
                </p>
              </div>

              {/* 标签 */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {['AI音频', '自然', '放松', '环境音乐', '森林'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full hover:bg-green-200 transition-colors cursor-pointer"
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
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-4">
                  <i className="fas fa-user text-white"></i>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-800">AI创作助手</h4>
                  <p className="text-sm text-slate-600">专业AI音乐制作人</p>
                </div>
                <button className="text-primary hover:text-green-600 font-medium text-sm">
                  关注
                </button>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* 底部：相关作品推荐 */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">相关作品</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedArtworks.map((artwork) => (
              <Link key={artwork.id} href="/audio-detail">
                <div className="group cursor-pointer">
                  <div className="glass rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-4">
                        <i className="fas fa-music text-white"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-800 group-hover:text-green-600 transition-colors">
                          {artwork.title}
                        </h4>
                        <p className="text-sm text-slate-600">{artwork.duration}</p>
                      </div>
                    </div>
                    
                    {/* 迷你波形 */}
                    <div className="flex items-center space-x-1 h-8 mb-4">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 bg-green-300 rounded-full group-hover:bg-green-400 transition-colors"
                          style={{
                            height: `${Math.random() * 20 + 8}px`,
                          }}
                        />
                      ))}
                    </div>
                    
                    <div className="flex items-center text-xs text-slate-500">
                      <i className="fas fa-music mr-2"></i>
                      <span>音频作品</span>
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
