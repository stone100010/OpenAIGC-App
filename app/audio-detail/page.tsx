'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useWorkData } from '@/hooks/useWorkData';
import { LoadingState, ActionButtons } from '@/components/common';
import { DetailPageLayout } from '@/components/detail';
import { ProtectedRoute } from '@/components/auth';

// 音频播放器组件
function AudioPlayer({
  isPlaying,
  onPlayPause,
  currentTime = '01:23',
  duration = '05:32'
}: {
  isPlaying: boolean;
  onPlayPause: () => void;
  currentTime?: string;
  duration?: string;
}) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-center space-x-6 mb-6">
        <button className="w-12 h-12 rounded-full bg-green-500/20 hover:bg-green-500/30 flex items-center justify-center transition-colors">
          <i className="fas fa-step-backward text-green-600" />
        </button>
        <button
          onClick={onPlayPause}
          className="w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center transition-colors shadow-lg"
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-xl ml-1`} />
        </button>
        <button className="w-12 h-12 rounded-full bg-green-500/20 hover:bg-green-500/30 flex items-center justify-center transition-colors">
          <i className="fas fa-step-forward text-green-600" />
        </button>
      </div>

      {/* 进度条 */}
      <div className="space-y-2">
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
            style={{ width: '23%' }}
          />
        </div>
        <div className="flex justify-between text-sm text-slate-600">
          <span>{currentTime}</span>
          <span>{duration}</span>
        </div>
      </div>
    </div>
  );
}

function AudioDetailContent() {
  const [isPlaying, setIsPlaying] = useState(false);
  const searchParams = useSearchParams();
  const workId = searchParams.get('id');

  const { data, loading, error, refetch } = useWorkData(workId);

  // 相关作品
  const relatedArtworks = [
    { id: 1, title: '电子音乐', duration: '03:45' },
    { id: 2, title: '自然之声', duration: '05:32' },
    { id: 3, title: '氛围音乐', duration: '04:18' }
  ];

  // 格式化时长
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '05:32';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DetailPageLayout
      loading={loading}
      error={error}
      data={data}
      themeColor="green"
      onRetry={refetch}
      relatedWorks={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedArtworks.map((artwork) => (
            <Link key={artwork.id} href={`/audio-detail${workId ? `?id=${workId}` : ''}`}>
              <div className="group cursor-pointer">
                <div className="glass rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-4">
                      <i className="fas fa-music text-white" />
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
                        style={{ height: `${Math.random() * 20 + 8}px` }}
                      />
                    ))}
                  </div>

                  <div className="flex items-center text-xs text-slate-500">
                    <i className="fas fa-music mr-2" />
                    <span>音频作品</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      }
    >
      {/* 音频内容展示 */}
      {data && (
        <div className="glass rounded-3xl p-8 bg-gradient-to-br from-green-50 to-teal-50 relative">
          {/* 音频信息头部 */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-4">{data.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-slate-600">
              <span className="flex items-center">
                <i className="fas fa-music mr-2" />
                音频作品
              </span>
              <span className="flex items-center">
                <i className="fas fa-clock mr-2" />
                {formatDuration(data.duration)}
              </span>
              <span className="flex items-center">
                <i className="fas fa-calendar-alt mr-2" />
                {new Date(data.createdAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>

          {/* 音频播放控制 */}
          <AudioPlayer
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            duration={formatDuration(data.duration)}
          />

          {/* 底部互动按钮 */}
          <div className="absolute bottom-6 right-6">
            <ActionButtons
              initialLiked={false}
              onLike={(liked) => console.log('Like:', liked)}
              onFavorite={(fav) => console.log('Favorite:', fav)}
              onShare={() => navigator.clipboard?.writeText(window.location.href)}
              onReport={() => alert('举报作品...')}
              size="md"
            />
          </div>
        </div>
      )}
    </DetailPageLayout>
  );
}

export default function AudioDetailPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <LoadingState message="加载中..." />
          </div>
        }
      >
        <AudioDetailContent />
      </Suspense>
    </ProtectedRoute>
  );
}
