'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useWorkData } from '@/hooks/useWorkData';
import { LoadingState, ActionButtons } from '@/components/common';
import { DetailPageLayout } from '@/components/detail';
import { ProtectedRoute } from '@/components/auth';

function VideoDetailContent() {
  const [isPlaying, setIsPlaying] = useState(false);
  const searchParams = useSearchParams();
  const workId = searchParams.get('id');

  const { data, loading, error, refetch } = useWorkData(workId);

  // 相关作品
  const relatedArtworks = [
    {
      id: 1,
      src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      title: '海浪视频'
    },
    {
      id: 2,
      src: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      title: '未来城市'
    },
    {
      id: 3,
      src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=200&h=200&fit=crop',
      title: '数字艺术'
    }
  ];

  // 格式化时长
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '02:45';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <DetailPageLayout
      loading={loading}
      error={error}
      data={data}
      themeColor="red"
      onRetry={refetch}
      relatedWorks={
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {relatedArtworks.map((artwork) => (
            <Link key={artwork.id} href={`/video-detail${workId ? `?id=${workId}` : ''}`}>
              <div className="group cursor-pointer">
                <div className="relative aspect-square overflow-hidden rounded-xl shadow-md">
                  <Image
                    src={artwork.src}
                    alt={artwork.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-12 h-12 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <i className="fas fa-play text-white" />
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
      }
    >
      {/* 视频内容展示 */}
      {data && (
        <div className="relative glass rounded-3xl overflow-hidden group aspect-video">
          <Image
            src={data.thumbnailUrl || data.mediaUrl || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=600&h=600&fit=crop'}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
          />

          {/* 视频播放控制 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300"
            >
              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'} text-white text-3xl ml-1`} />
            </button>
          </div>

          {/* 视频时长 */}
          <div className="absolute bottom-4 left-4">
            <span className="bg-black/50 text-white px-2 py-1 rounded text-sm">
              {formatDuration(data.duration)}
            </span>
          </div>

          {/* 右下角互动按钮组 */}
          <div className="absolute bottom-4 right-4">
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

export default function VideoDetailPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <LoadingState message="加载中..." />
          </div>
        }
      >
        <VideoDetailContent />
      </Suspense>
    </ProtectedRoute>
  );
}
