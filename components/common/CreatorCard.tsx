'use client';

/**
 * 创作者卡片组件
 * 展示作品创作者信息
 */

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Creator } from '@/types/work';

interface CreatorCardProps {
  creator: Creator;
  showBio?: boolean;
  showFollowButton?: boolean;
  className?: string;
}

export default function CreatorCard({
  creator,
  showBio = true,
  showFollowButton = true,
  className = ''
}: CreatorCardProps) {
  return (
    <div className={`glass rounded-2xl p-4 ${className}`}>
      <div className="flex items-center gap-3">
        {/* 头像 */}
        <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white/50 bg-gradient-to-r from-blue-400 to-purple-500">
          {creator.avatarUrl ? (
            <Image
              src={creator.avatarUrl}
              alt={creator.displayName}
              fill
              className="object-cover"
              onError={(e) => {
                // 图片加载失败时隐藏图片，显示默认图标
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center">
            <i className="fas fa-user text-white text-lg"></i>
          </div>
        </div>

        {/* 信息 */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-slate-800 truncate">
            {creator.displayName}
          </h4>
          <p className="text-sm text-slate-500 truncate">@{creator.username}</p>
        </div>

        {/* 关注按钮 */}
        {showFollowButton && (
          <button className="px-4 py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-sm rounded-full font-medium hover:shadow-lg transition-all duration-300">
            关注
          </button>
        )}
      </div>

      {/* 简介 */}
      {showBio && creator.bio && (
        <p className="mt-3 text-sm text-slate-600 line-clamp-2">{creator.bio}</p>
      )}
    </div>
  );
}

/**
 * 简洁版创作者信息 (用于卡片内)
 */
export function CreatorInfo({
  creator,
  size = 'md'
}: {
  creator: Pick<Creator, 'username' | 'displayName' | 'avatarUrl'>;
  size?: 'sm' | 'md';
}) {
  const avatarSize = size === 'sm' ? 'w-6 h-6' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${avatarSize} rounded-full overflow-hidden bg-gradient-to-r from-blue-400 to-purple-500`}>
        {creator.avatarUrl ? (
          <Image
            src={creator.avatarUrl}
            alt={creator.displayName}
            fill
            className="object-cover"
            onError={(e) => {
              // 图片加载失败时隐藏图片，显示默认图标
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
            }}
          />
        ) : null}
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-user text-white"></i>
        </div>
      </div>
      <span className={`${textSize} text-slate-600 truncate`}>
        {creator.displayName}
      </span>
    </div>
  );
}
