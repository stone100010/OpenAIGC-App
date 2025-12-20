'use client';

import Link from 'next/link';
import { WorkListItem } from '@/types/work';

interface TextWorkCardProps {
  work: WorkListItem;
}

export function TextWorkCard({ work }: TextWorkCardProps) {
  // 预览文本内容
  const previewText = work.description || '点击查看完整内容...';

  return (
    <Link href={`/text-detail?id=${work.id}`}>
      <div className="group cursor-pointer break-inside-avoid mb-4">
        <div className="glass rounded-2xl p-4 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
          {/* 图标 */}
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md mb-3">
            <i className="fas fa-file-alt text-white" />
          </div>

          {/* 标题 */}
          <h3 className="font-bold text-slate-800 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
            {work.title}
          </h3>

          {/* 内容预览 */}
          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {previewText}
          </p>

          {/* 标签 */}
          {work.tags && work.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3">
              {work.tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
