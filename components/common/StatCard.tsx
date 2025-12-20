'use client';

/**
 * 统计卡片组件
 * 用于展示数字统计信息
 */

import React from 'react';

interface StatCardProps {
  icon: string;
  iconColor?: string;
  iconBgColor?: string;
  value: string | number;
  label: string;
  trend?: {
    value: number;
    isUp: boolean;
  };
  className?: string;
}

export default function StatCard({
  icon,
  iconColor = 'text-amber-600',
  iconBgColor = 'bg-amber-100',
  value,
  label,
  trend,
  className = ''
}: StatCardProps) {
  return (
    <div className={`glass rounded-2xl p-4 ${className}`}>
      <div className="flex items-start gap-3">
        {/* 图标 */}
        <div className={`w-10 h-10 ${iconBgColor} rounded-xl flex items-center justify-center`}>
          <i className={`fa-solid ${icon} ${iconColor}`} />
        </div>

        {/* 数据 */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{value}</span>
            {trend && (
              <span className={`text-xs font-medium ${trend.isUp ? 'text-green-500' : 'text-red-500'}`}>
                <i className={`fa-solid fa-arrow-${trend.isUp ? 'up' : 'down'} mr-0.5`} />
                {trend.value}%
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * 紧凑版统计显示 (用于卡片内)
 */
export function StatBadge({
  icon,
  value,
  className = ''
}: {
  icon: string;
  value: string | number;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-1 text-slate-500 ${className}`}>
      <i className={`fa-solid ${icon} text-xs`} />
      <span className="text-sm">{value}</span>
    </span>
  );
}

/**
 * 统计行 (用于详情页)
 */
export function StatsRow({
  stats,
  className = ''
}: {
  stats: Array<{ icon: string; value: string | number; label?: string }>;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-1.5 text-slate-600">
          <i className={`fa-solid ${stat.icon} text-sm`} />
          <span className="font-medium">{stat.value}</span>
          {stat.label && <span className="text-sm text-slate-400">{stat.label}</span>}
        </div>
      ))}
    </div>
  );
}
