'use client';

import { useState } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Link from 'next/link';

export default function TextDetailPage() {
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

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

  const textContent = `
在无垠的宇宙深处，星辰如钻石般闪烁，引领着人类探索未知的勇气与梦想。

在这片浩渺的星海中，每一个闪烁的光点都承载着无数的可能性。它们见证了文明的兴衰，记录了时间的流转。当第一缕晨光穿过云层洒向大地，整个世界仿佛被镀上一层金辉。在这个宁静的早晨，一切都显得那么美好而充满希望。

人类的想象力就像宇宙一样无限广阔。我们在文字中编织梦想，在故事里寻找意义，在诗歌中表达情感。每一个字句都是心灵的印记，每一段文字都是思想的结晶。

当我们凝视星空，不仅仅是在欣赏美景，更是在与宇宙对话，在与时间交流。那闪烁的星辰提醒我们，即使在最黑暗的时刻，也有光明等待着我们。

愿每一个梦想都能如星辰般闪耀，照亮前进的道路，指引我们到达心中的彼岸。

`;

  const relatedArtworks = [
    {
      id: 1,
      title: '创意故事',
      excerpt: '当第一缕晨光穿过云层洒向大地...',
      type: 'text'
    },
    {
      id: 2,
      title: '现代诗集',
      excerpt: '在时光的长河中，我们寻觅着...',
      type: 'text'
    },
    {
      id: 3,
      title: '散文随笔',
      excerpt: '生活就像一杯茶，苦中有甜...',
      type: 'text'
    }
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：主内容区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 文字内容展示 */}
            <div className="glass rounded-3xl p-8 bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-slate-800 mb-4">诗歌创作</h1>
                <div className="flex items-center space-x-4 text-sm text-slate-600">
                  <span className="flex items-center">
                    <i className="fas fa-calendar-alt mr-2"></i>
                    2025年11月
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-file-alt mr-2"></i>
                    文字作品
                  </span>
                  <span className="flex items-center">
                    <i className="fas fa-clock mr-2"></i>
                    5分钟阅读
                  </span>
                </div>
              </div>

              {/* 文字内容 */}
              <div className="prose prose-slate max-w-none">
                {textContent.trim().split('\n\n').map((paragraph, index) => (
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
                  <div className="text-2xl font-bold text-purple-600">3.2k</div>
                  <div className="text-sm text-slate-600">阅读</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-500">187</div>
                  <div className="text-sm text-slate-600">点赞</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">34</div>
                  <div className="text-sm text-slate-600">收藏</div>
                </div>
              </div>

              {/* 作品信息 */}
              <div className="mb-6">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">字数</span>
                    <span className="text-slate-800 font-medium">486字</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">类型</span>
                    <span className="text-slate-800 font-medium">现代诗</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">主题</span>
                    <span className="text-slate-800 font-medium">星空与梦想</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">创作时间</span>
                    <span className="text-slate-800 font-medium">2025年11月</span>
                  </div>
                </div>
              </div>

              {/* 标签 */}
              <div className="mb-6">
                <h3 className="font-semibold text-slate-800 mb-3">标签</h3>
                <div className="flex flex-wrap gap-2">
                  {['AI创作', '诗歌', '星空', '梦想', '文学'].map((tag) => (
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
                  <h4 className="font-medium text-slate-800">AI创作助手</h4>
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
            {relatedArtworks.map((artwork) => (
              <Link key={artwork.id} href="/text-detail">
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
