'use client';

import Image from 'next/image';
import Link from 'next/link';
import { WorkListItem } from '@/types/work';

interface VideoWorkCardProps {
  work: WorkListItem;
  priority?: boolean;
}

export function VideoWorkCard({ work, priority = false }: VideoWorkCardProps) {
  const defaultImage = 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=400&h=300&fit=crop';

  // 格式化时长
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Link href={`/video-detail?id=${work.id}`}>
      <div className="group cursor-pointer break-inside-avoid mb-4">
        <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
          {/* 视频封面 - 高度自适应 */}
          <Image
            src={work.thumbnailUrl || work.mediaUrl || defaultImage}
            alt={work.title}
            width={400}
            height={0}
            priority={priority}
            className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            style={{ height: 'auto' }}
          />

          {/* 遮罩层 */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />

          {/* 播放按钮 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300">
              <i className="fas fa-play text-white text-sm ml-0.5" />
            </div>
          </div>

          {/* 时长标签 */}
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white text-xs rounded">
              {formatDuration(work.duration)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
