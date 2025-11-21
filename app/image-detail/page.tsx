'use client';

import { useState } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';

export default function ImageDetailPage() {
  const [isLiked, setIsLiked] = useState(false);

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

  const artworkImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=600&h=600&fit=crop';

  const relatedArtworks = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      title: '抽象艺术',
      type: 'image'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      title: '未来科技',
      type: 'image'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      title: '数字艺术',
      type: 'image'
    }
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：主图像区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 主图像展示 */}
            <div className="relative glass rounded-3xl overflow-hidden group aspect-square">
              <Image
                src={artworkImage}
                alt="作品预览"
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
              <h2 className="text-2xl font-bold text-slate-800 mb-3">梦幻森林</h2>
              <p className="text-slate-600 mb-4">AI生成 • 图片 • 2025年11月</p>
              
              {/* 统计信息 */}
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">2.4k</div>
                  <div className="text-sm text-slate-600">浏览</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">156</div>
                  <div className="text-sm text-slate-600">点赞</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">23</div>
                  <div className="text-sm text-slate-600">收藏</div>
                </div>
              </div>

              {/* 描述 */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-2">作品描述</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  这幅AI生成的图片作品展现了梦幻般的森林场景，充满了神秘和想象力。
                  柔和的色彩和光影效果营造出超现实的氛围，引人入胜。
                </p>
              </div>

              {/* 标签 */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {['AI艺术', '图片生成', '梦幻', '森林', '超现实'].map((tag) => (
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
                  <h4 className="font-medium text-slate-800">AI创作助手</h4>
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
            {relatedArtworks.map((artwork) => (
              <Link key={artwork.id} href="/image-detail">
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
