'use client';

/**
 * 作品详情页面布局组件
 * 统一的详情页面结构
 */

import React, { ReactNode } from 'react';
import Link from 'next/link';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import { LoadingState, ErrorState, ActionButtons, StatsRow } from '@/components/common';
import type { WorkData, ContentType, CONTENT_TYPE_CONFIG } from '@/types/work';

interface DetailPageLayoutProps {
  loading: boolean;
  error: string | null;
  data: WorkData | null;
  themeColor: string;
  onRetry?: () => void;
  children: ReactNode;
  relatedWorks?: ReactNode;
}

/**
 * 详情页面布局容器
 */
export default function DetailPageLayout({
  loading,
  error,
  data,
  themeColor,
  onRetry,
  children,
  relatedWorks
}: DetailPageLayoutProps) {
  // 加载状态
  if (loading) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <LoadingState message="加载作品信息中..." />
      </div>
    );
  }

  // 错误状态
  if (error || !data) {
    return (
      <div className="min-h-screen pb-24 flex items-center justify-center">
        <ErrorState
          title="作品不存在"
          message={error || '未找到作品信息'}
          onRetry={onRetry}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：主内容区域 */}
          <div className="lg:col-span-2 space-y-6">
            {children}
          </div>

          {/* 右侧：信息面板 */}
          <div className="space-y-6">
            <WorkInfoPanel data={data} themeColor={themeColor} />
            <CreatorPanel creator={data.creator} themeColor={themeColor} />
          </div>
        </div>

        {/* 底部：相关作品推荐 */}
        {relatedWorks && (
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-slate-800 mb-6">相关作品</h3>
            {relatedWorks}
          </div>
        )}
      </div>

      <TabBar />
    </div>
  );
}

/**
 * 作品信息面板
 */
export function WorkInfoPanel({
  data,
  themeColor
}: {
  data: WorkData;
  themeColor: string;
}) {
  const colorClasses: Record<string, { text: string; bg: string }> = {
    blue: { text: 'text-blue-600', bg: 'bg-blue-100' },
    green: { text: 'text-green-600', bg: 'bg-green-100' },
    red: { text: 'text-red-600', bg: 'bg-red-100' },
    purple: { text: 'text-purple-600', bg: 'bg-purple-100' },
    amber: { text: 'text-amber-600', bg: 'bg-amber-100' }
  };

  const colors = colorClasses[themeColor] || colorClasses.blue;

  return (
    <GlassCard className="hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-2xl font-bold text-slate-800 mb-3">{data.title}</h2>
      <p className="text-slate-600 mb-4">
        AI生成 • {data.contentType} • {new Date(data.createdAt).toLocaleDateString('zh-CN')}
      </p>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <div className={`text-2xl font-bold ${colors.text}`}>{data.viewsCount}</div>
          <div className="text-sm text-slate-600">浏览</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-red-500">{data.likesCount}</div>
          <div className="text-sm text-slate-600">点赞</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-600">{Math.floor(data.likesCount * 0.1)}</div>
          <div className="text-sm text-slate-600">收藏</div>
        </div>
      </div>

      {/* 描述 */}
      {data.description && (
        <div className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-2">描述</h3>
          <p className="text-slate-600 text-sm leading-relaxed">{data.description}</p>
        </div>
      )}

      {/* 标签 */}
      {data.tags && data.tags.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold text-slate-800 mb-3">标签</h3>
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag) => (
              <span
                key={tag}
                className={`px-3 py-1 ${colors.bg} ${colors.text} text-sm rounded-full hover:opacity-80 transition-opacity cursor-pointer`}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </GlassCard>
  );
}

/**
 * 创作者面板
 */
export function CreatorPanel({
  creator,
  themeColor
}: {
  creator: WorkData['creator'];
  themeColor: string;
}) {
  const gradients: Record<string, string> = {
    blue: 'from-blue-500 to-indigo-600',
    green: 'from-green-500 to-teal-600',
    red: 'from-red-500 to-pink-600',
    purple: 'from-purple-500 to-pink-600',
    amber: 'from-amber-500 to-orange-600'
  };

  const gradient = gradients[themeColor] || gradients.blue;

  return (
    <GlassCard className="hover:shadow-xl transition-shadow duration-300">
      <h3 className="font-semibold text-slate-800 mb-4">创作者</h3>
      <div className="flex items-center">
        <Link href={`/profile?id=${creator.id}`} className="flex items-center flex-1 hover:opacity-80 transition-opacity cursor-pointer">
          <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center mr-4 overflow-hidden`}>
            {creator.avatarUrl ? (
              <Image
                src={creator.avatarUrl}
                alt={creator.displayName}
                width={48}
                height={48}
                className="object-cover"
                onError={(e) => {
                  // 如果头像加载失败，隐藏图片，显示默认图标
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            ) : null}
            {!creator.avatarUrl && <i className="fas fa-user text-white" />}
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-slate-800 hover:text-blue-600 transition-colors">{creator.displayName}</h4>
          </div>
        </Link>
        <button 
          className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm rounded-full font-medium hover:shadow-lg transition-all duration-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('关注创作者:', creator.id);
          }}
        >
          关注
        </button>
      </div>
    </GlassCard>
  );
}

/**
 * 媒体展示容器 (图片/视频)
 */
export function MediaDisplay({
  src,
  alt,
  type = 'image',
  onPreview,
  actions,
  className = ''
}: {
  src?: string;
  alt: string;
  type?: 'image' | 'video';
  onPreview?: () => void;
  actions?: ReactNode;
  className?: string;
}) {
  // 确保 src 有值，使用默认图片作为后备
  const safeSrc = src && src.trim() ? src : '/20250731114736.jpg';
  
  return (
    <div
      className={`relative glass rounded-3xl overflow-hidden group cursor-pointer ${className}`}
      style={{ height: '33.33vh', minHeight: '250px', maxHeight: '600px' }}
      onClick={onPreview}
    >
      {type === 'image' ? (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
          <Image
            src={safeSrc}
            alt={alt || '作品图片'}
            width={800}
            height={600}
            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
            onError={(e) => {
              // 如果图片加载失败，显示默认图片
              const target = e.target as HTMLImageElement;
              target.src = '/20250731114736.jpg';
            }}
          />
        </div>
      ) : (
        <video
          src={safeSrc}
          className="w-full h-full object-contain"
          controls={false}
        />
      )}

      {/* 操作按钮 */}
      {actions && (
        <div className="absolute bottom-4 right-4 flex space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
}

/**
 * 图片预览模态框
 */
export function ImagePreviewModal({
  src,
  alt,
  onClose
}: {
  src?: string;
  alt: string;
  onClose: () => void;
}) {
  // 确保 src 有值，使用默认图片作为后备
  const safeSrc = src && src.trim() ? src : '/20250731114736.jpg';
  
  return (
    <div
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-full max-h-full">
        <Image
          src={safeSrc}
          alt={alt || '作品图片'}
          width={800}
          height={600}
          className="max-w-full max-h-full object-contain rounded-lg"
          sizes="100vw"
          onError={(e) => {
            // 如果图片加载失败，显示默认图片
            const target = e.target as HTMLImageElement;
            target.src = '/20250731114736.jpg';
          }}
        />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors duration-200"
        >
          <i className="fas fa-times" />
        </button>
      </div>
    </div>
  );
}
