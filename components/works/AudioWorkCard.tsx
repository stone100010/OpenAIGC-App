'use client';

import Link from 'next/link';
import { WorkListItem } from '@/types/work';

interface AudioWorkCardProps {
  work: WorkListItem;
}

export function AudioWorkCard({ work }: AudioWorkCardProps) {
  // 格式化时长
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 生成随机波形高度
  const waveHeights = Array.from({ length: 24 }, () => Math.random() * 20 + 6);

  return (
    <Link href={`/audio-detail?id=${work.id}`}>
      <div className="group cursor-pointer break-inside-avoid mb-4">
        <div className="glass rounded-2xl p-4 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-green-50 to-teal-50">
          {/* 头部 */}
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center shadow-md">
              <i className="fas fa-music text-white" />
            </div>
            <span className="text-sm text-slate-600 font-medium">
              {formatDuration(work.duration)}
            </span>
          </div>

          {/* 标题 */}
          <h3 className="font-semibold text-slate-800 text-sm line-clamp-2 group-hover:text-green-600 transition-colors mb-3">
            {work.title}
          </h3>

          {/* 波形动画 */}
          <div className="flex items-center justify-center space-x-0.5 h-8 mb-3">
            {waveHeights.map((height, i) => (
              <div
                key={i}
                className="w-1 bg-green-400 rounded-full group-hover:bg-green-500 transition-all duration-300"
                style={{ height: `${height}px` }}
              />
            ))}
          </div>

          {/* 播放按钮 */}
          <div className="flex justify-center">
            <button className="w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center transition-colors shadow-md">
              <i className="fas fa-play text-white text-sm ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
