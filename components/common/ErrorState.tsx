'use client';

/**
 * 错误状态组件
 * 统一的错误状态展示
 */

import React from 'react';
import Link from 'next/link';

interface ErrorStateProps {
  title?: string;
  message?: string;
  showRetry?: boolean;
  showHome?: boolean;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorState({
  title = '出错了',
  message = '加载数据时发生错误，请稍后重试',
  showRetry = true,
  showHome = true,
  onRetry,
  className = ''
}: ErrorStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-6 p-8 ${className}`}>
      {/* 错误图标 */}
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
        <i className="fa-solid fa-exclamation-triangle text-3xl text-red-500" />
      </div>

      {/* 错误信息 */}
      <div className="text-center">
        <h3 className="text-xl font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-500 max-w-md">{message}</p>
      </div>

      {/* 操作按钮 */}
      <div className="flex gap-3">
        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
          >
            <i className="fa-solid fa-refresh mr-2" />
            重试
          </button>
        )}
        {showHome && (
          <Link
            href="/home"
            className="px-6 py-2.5 bg-slate-100 text-slate-700 rounded-xl font-medium hover:bg-slate-200 transition-all duration-300"
          >
            <i className="fa-solid fa-home mr-2" />
            返回首页
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * 全屏错误状态
 */
export function FullScreenError(props: ErrorStateProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 z-50">
      <ErrorState {...props} />
    </div>
  );
}
