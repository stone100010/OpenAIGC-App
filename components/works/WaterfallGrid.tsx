'use client';

import { useRef, useEffect } from 'react';
import { WorkListItem } from '@/types/work';
import { WorkCard } from './WorkCard';

interface WaterfallGridProps {
  works: WorkListItem[];
  loading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  emptyMessage?: string;
}

export function WaterfallGrid({
  works,
  loading = false,
  hasMore = false,
  onLoadMore,
  emptyMessage = '暂无作品'
}: WaterfallGridProps) {
  const loaderRef = useRef<HTMLDivElement>(null);

  // 手动分配左右两列，保持稳定顺序
  const leftColumn: WorkListItem[] = [];
  const rightColumn: WorkListItem[] = [];

  works.forEach((work, index) => {
    if (index % 2 === 0) {
      leftColumn.push(work);
    } else {
      rightColumn.push(work);
    }
  });

  // 无限滚动加载
  useEffect(() => {
    if (!onLoadMore || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  // 空状态
  if (!loading && works.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <i className="fas fa-inbox text-3xl text-slate-400" />
        </div>
        <p className="text-slate-500 text-lg">{emptyMessage}</p>
        <p className="text-slate-400 text-sm mt-2">快去创作你的第一个作品吧</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 两列瀑布流 - 手动分配 */}
      <div className="flex gap-3">
        {/* 左列 */}
        <div className="flex-1">
          {leftColumn.map((work, index) => (
            <WorkCard
              key={work.id}
              work={work}
              priority={index < 2}
            />
          ))}
        </div>

        {/* 右列 */}
        <div className="flex-1">
          {rightColumn.map((work, index) => (
            <WorkCard
              key={work.id}
              work={work}
              priority={index < 2}
            />
          ))}
        </div>
      </div>

      {/* 加载更多指示器 */}
      <div ref={loaderRef} className="py-6">
        {loading && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        {!loading && hasMore && (
          <p className="text-center text-slate-400 text-sm">上滑加载更多</p>
        )}
        {!loading && !hasMore && works.length > 0 && (
          <p className="text-center text-slate-400 text-sm">- 已显示全部 {works.length} 个作品 -</p>
        )}
      </div>
    </div>
  );
}
