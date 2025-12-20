'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import TabBar from '@/components/ui/TabBar';
import { WaterfallGrid } from '@/components/works';
import { WorkListItem, ContentType } from '@/types/work';
import { ProtectedRoute } from '@/components/auth';

function HomeContent() {
  const [works, setWorks] = useState<WorkListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState<ContentType | 'all'>('all');
  const loadingRef = useRef(false);

  // 类型筛选配置
  const filterOptions: { key: ContentType | 'all'; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: 'fas fa-th-large' },
    { key: 'image', label: '图片', icon: 'fas fa-image' },
    { key: 'video', label: '视频', icon: 'fas fa-video' },
    { key: 'audio', label: '音频', icon: 'fas fa-music' },
    { key: 'text', label: '文本', icon: 'fas fa-file-alt' },
  ];

  // 加载作品数据
  const loadWorks = useCallback(async (reset = false) => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;

      if (reset) {
        setIsLoading(true);
      }

      setError(null);

      const currentOffset = reset ? 0 : offset;
      const typeParam = activeFilter !== 'all' ? `&type=${activeFilter}` : '';
      const response = await fetch(
        `/api/creative-works-simple?offset=${currentOffset}&limit=12${typeParam}`
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || '获取数据失败');
      }

      const newWorks: WorkListItem[] = data.data.works || [];

      if (reset) {
        setWorks(newWorks);
        setOffset(12);
      } else {
        setWorks(prev => {
          const existingIds = new Set(prev.map(w => w.id));
          const uniqueNewWorks = newWorks.filter(work => !existingIds.has(work.id));
          return [...prev, ...uniqueNewWorks];
        });
        setOffset(prev => prev + 12);
      }

      setHasMore(data.data.pagination?.hasMore ?? newWorks.length === 12);

    } catch (err) {
      console.error('加载失败:', err);
      setError(err instanceof Error ? err.message : '加载失败，请重试');
    } finally {
      setIsLoading(false);
      loadingRef.current = false;
    }
  }, [offset, activeFilter]);

  // 初始加载
  useEffect(() => {
    loadWorks(true);
  }, [activeFilter]);

  // 切换筛选
  const handleFilterChange = (filter: ContentType | 'all') => {
    if (filter === activeFilter) return;
    setActiveFilter(filter);
    setOffset(0);
    setWorks([]);
  };

  // 加载更多
  const handleLoadMore = useCallback(() => {
    if (!loadingRef.current && hasMore) {
      loadWorks(false);
    }
  }, [hasMore, loadWorks]);

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* 固定顶部 */}
      <div className="sticky top-0 z-10 bg-gradient-to-br from-orange-50/95 via-white/95 to-amber-50/95 backdrop-blur-sm border-b border-slate-200/50">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-xl font-bold text-slate-800">创作天地</h1>
              <p className="text-xs text-slate-500">发现无限创意可能</p>
            </div>
            <button
              onClick={() => loadWorks(true)}
              disabled={isLoading}
              className="w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-sm transition-colors disabled:opacity-50"
            >
              <i className={`fas fa-sync-alt text-slate-600 text-sm ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {/* 类型筛选 */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide -mx-1 px-1">
            {filterOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => handleFilterChange(option.key)}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap
                  transition-all duration-300
                  ${activeFilter === option.key
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md'
                    : 'bg-white/70 text-slate-600 hover:bg-white'
                  }
                `}
              >
                <i className={option.icon} />
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-lg mx-auto px-3 py-4">
        {/* 错误状态 */}
        {error && !isLoading && (
          <div className="glass rounded-2xl p-6 text-center mb-4">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <i className="fas fa-exclamation-triangle text-red-500 text-xl" />
            </div>
            <h3 className="text-base font-semibold text-slate-800 mb-2">加载失败</h3>
            <p className="text-slate-600 text-sm mb-4">{error}</p>
            <button
              onClick={() => loadWorks(true)}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
            >
              重新加载
            </button>
          </div>
        )}

        {/* 骨架屏加载 */}
        {isLoading && works.length === 0 && (
          <div className="flex gap-3">
            <div className="flex-1">
              {[180, 220, 160].map((h, i) => (
                <div key={`skeleton-l-${i}`} className="mb-4">
                  <div className="glass rounded-2xl overflow-hidden">
                    <div className="bg-slate-200 animate-pulse" style={{ height: `${h}px` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1">
              {[150, 200, 180].map((h, i) => (
                <div key={`skeleton-r-${i}`} className="mb-4">
                  <div className="glass rounded-2xl overflow-hidden">
                    <div className="bg-slate-200 animate-pulse" style={{ height: `${h}px` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 作品瀑布流 */}
        {!error && (
          <WaterfallGrid
            works={works}
            loading={isLoading && works.length > 0}
            hasMore={hasMore}
            onLoadMore={handleLoadMore}
            emptyMessage={
              activeFilter === 'all'
                ? '暂无创作作品'
                : `暂无${filterOptions.find(f => f.key === activeFilter)?.label}作品`
            }
          />
        )}
      </div>

      <TabBar />
    </div>
  );
}

export default function HomePage() {
  return (
    <ProtectedRoute>
      <HomeContent />
    </ProtectedRoute>
  );
}
