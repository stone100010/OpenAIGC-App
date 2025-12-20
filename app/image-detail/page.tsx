'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useWorkData } from '@/hooks/useWorkData';
import { useAuthorWorks } from '@/hooks/useAuthorWorks';
import { LoadingState, ActionButtons } from '@/components/common';
import {
  DetailPageLayout,
  MediaDisplay,
  ImagePreviewModal
} from '@/components/detail';
import { ProtectedRoute } from '@/components/auth';

function ImageDetailContent() {
  const [showImagePreview, setShowImagePreview] = useState(false);
  const searchParams = useSearchParams();
  const workId = searchParams.get('id');

  const { data, loading, error, refetch } = useWorkData(workId);
  
  // 获取当前作者的作品
  const { works: authorWorks, loading: worksLoading } = useAuthorWorks(data?.creator.id || null);

  // 获取相关作品（排除当前作品）
  const getRelatedArtworks = () => {
    if (!data || !authorWorks) return [];
    return authorWorks
      .filter(work => work.id !== data.id)
      .slice(0, 4);
  };

  return (
    <DetailPageLayout
      loading={loading}
      error={error}
      data={data}
      themeColor="blue"
      onRetry={refetch}
      relatedWorks={
        data && (
          <>
            {worksLoading ? (
              <div className="flex justify-center py-8">
                <LoadingState message="加载作者作品..." />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {getRelatedArtworks().length > 0 ? (
                  getRelatedArtworks().map((artwork) => (
                    <Link key={artwork.id} href={`/image-detail?id=${artwork.id}`}>
                      <div className="group cursor-pointer">
                        <div className="relative aspect-square overflow-hidden rounded-xl shadow-md">
                          <Image
                            src={artwork.thumbnailUrl || artwork.mediaUrl || '/20250731114736.jpg'}
                            alt={artwork.title || '作品图片'}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            onError={(e) => {
                              // 如果图片加载失败，显示默认图片
                              const target = e.target as HTMLImageElement;
                              target.src = '/20250731114736.jpg';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <div className="text-slate-500">
                      <i className="fas fa-image text-4xl mb-2 opacity-50"></i>
                      <p>作者暂无其他作品</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )
      }
    >
      {/* 主图像展示 */}
      {data && (
        <>
          <MediaDisplay
            src={data.thumbnailUrl || data.mediaUrl}
            alt={data.title || '作品图片'}
            type="image"
            onPreview={() => setShowImagePreview(true)}
            actions={
              <ActionButtons
                initialLiked={false}
                onLike={(liked) => console.log('Like:', liked)}
                onFavorite={(fav) => console.log('Favorite:', fav)}
                onShare={() => navigator.clipboard?.writeText(window.location.href)}
                onReport={() => alert('举报作品...')}
                size="md"
              />
            }
          />

          {/* 图片预览模态框 */}
          {showImagePreview && (
            <ImagePreviewModal
              src={data.thumbnailUrl || data.mediaUrl}
              alt={data.title || '作品图片'}
              onClose={() => setShowImagePreview(false)}
            />
          )}
        </>
      )}
    </DetailPageLayout>
  );
}

export default function ImageDetailPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <LoadingState message="加载中..." />
          </div>
        }
      >
        <ImageDetailContent />
      </Suspense>
    </ProtectedRoute>
  );
}
