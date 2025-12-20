'use client';

import Image from 'next/image';
import Link from 'next/link';
import { WorkListItem } from '@/types/work';

interface ImageWorkCardProps {
  work: WorkListItem;
  priority?: boolean;
}

export function ImageWorkCard({ work, priority = false }: ImageWorkCardProps) {
  const defaultImage = 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop';

  return (
    <Link href={`/image-detail?id=${work.id}`}>
      <div className="group cursor-pointer break-inside-avoid mb-4">
        <div className="relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300">
          {/* 图片容器 - 高度自适应 */}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* 悬浮信息 */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <h3 className="text-white font-semibold text-sm line-clamp-1 mb-1">
              {work.title}
            </h3>
            <div className="flex items-center justify-between text-white/80 text-xs">
              <span className="flex items-center">
                <i className="fas fa-eye mr-1" />
                {work.viewsCount || 0}
              </span>
              <span className="flex items-center">
                <i className="fas fa-heart mr-1" />
                {work.likesCount || 0}
              </span>
            </div>
          </div>

        </div>
      </div>
    </Link>
  );
}
