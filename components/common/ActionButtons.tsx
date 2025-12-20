'use client';

/**
 * 操作按钮组组件
 * 用于作品详情页的点赞、收藏、分享等操作
 */

import React, { useState } from 'react';

interface ActionButtonsProps {
  initialLiked?: boolean;
  initialFavorited?: boolean;
  likesCount?: number;
  onLike?: (liked: boolean) => void;
  onFavorite?: (favorited: boolean) => void;
  onShare?: () => void;
  onDownload?: () => void;
  onReport?: () => void;
  showLabels?: boolean;
  layout?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg'
};

export default function ActionButtons({
  initialLiked = false,
  initialFavorited = false,
  likesCount = 0,
  onLike,
  onFavorite,
  onShare,
  onDownload,
  onReport,
  showLabels = false,
  layout = 'horizontal',
  size = 'md',
  className = ''
}: ActionButtonsProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [currentLikes, setCurrentLikes] = useState(likesCount);

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setCurrentLikes(prev => newLiked ? prev + 1 : prev - 1);
    onLike?.(newLiked);
  };

  const handleFavorite = () => {
    const newFavorited = !isFavorited;
    setIsFavorited(newFavorited);
    onFavorite?.(newFavorited);
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // 默认复制链接
      navigator.clipboard?.writeText(window.location.href);
    }
  };

  const buttonBaseClass = `${sizeClasses[size]} rounded-full backdrop-blur-sm transition-all duration-300 flex items-center justify-center`;

  const layoutClass = layout === 'vertical' ? 'flex-col' : 'flex-row';

  return (
    <div className={`flex ${layoutClass} gap-2 ${className}`}>
      {/* 点赞 */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleLike}
          className={`${buttonBaseClass} ${
            isLiked
              ? 'bg-red-500/90 text-white shadow-lg'
              : 'bg-white/40 hover:bg-white/60 text-slate-700'
          }`}
          title={isLiked ? '取消点赞' : '点赞'}
        >
          <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`} />
        </button>
        {showLabels && (
          <span className="text-xs text-slate-500 mt-1">{currentLikes}</span>
        )}
      </div>

      {/* 收藏 */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleFavorite}
          className={`${buttonBaseClass} ${
            isFavorited
              ? 'bg-amber-500/90 text-white shadow-lg'
              : 'bg-white/40 hover:bg-white/60 text-slate-700'
          }`}
          title={isFavorited ? '取消收藏' : '收藏'}
        >
          <i className={`fa-${isFavorited ? 'solid' : 'regular'} fa-bookmark`} />
        </button>
        {showLabels && (
          <span className="text-xs text-slate-500 mt-1">收藏</span>
        )}
      </div>

      {/* 分享 */}
      <div className="flex flex-col items-center">
        <button
          onClick={handleShare}
          className={`${buttonBaseClass} bg-white/40 hover:bg-white/60 text-slate-700`}
          title="分享"
        >
          <i className="fa-solid fa-share-nodes" />
        </button>
        {showLabels && (
          <span className="text-xs text-slate-500 mt-1">分享</span>
        )}
      </div>

      {/* 下载 */}
      {onDownload && (
        <div className="flex flex-col items-center">
          <button
            onClick={onDownload}
            className={`${buttonBaseClass} bg-white/40 hover:bg-white/60 text-slate-700`}
            title="下载"
          >
            <i className="fa-solid fa-download" />
          </button>
          {showLabels && (
            <span className="text-xs text-slate-500 mt-1">下载</span>
          )}
        </div>
      )}

      {/* 举报 */}
      {onReport && (
        <div className="flex flex-col items-center">
          <button
            onClick={onReport}
            className={`${buttonBaseClass} bg-white/40 hover:bg-white/60 text-slate-700`}
            title="举报"
          >
            <i className="fa-solid fa-flag" />
          </button>
          {showLabels && (
            <span className="text-xs text-slate-500 mt-1">举报</span>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * 浮动操作按钮 (用于图片/视频上方)
 */
export function FloatingActions({
  onLike,
  onFavorite,
  onShare,
  initialLiked = false,
  initialFavorited = false,
  className = ''
}: Pick<ActionButtonsProps, 'onLike' | 'onFavorite' | 'onShare' | 'initialLiked' | 'initialFavorited' | 'className'>) {
  return (
    <div className={`absolute top-4 right-4 flex gap-2 ${className}`}>
      <ActionButtons
        initialLiked={initialLiked}
        initialFavorited={initialFavorited}
        onLike={onLike}
        onFavorite={onFavorite}
        onShare={onShare}
        size="sm"
      />
    </div>
  );
}
