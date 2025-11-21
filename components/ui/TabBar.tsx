'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  href: string;
}

interface TabBarProps {
  className?: string;
}

const tabs: TabItem[] = [
  { id: 'home', label: '首页', icon: 'fas fa-house', href: '/home' },
  { id: 'tools', label: '工具', icon: 'fas fa-wrench', href: '/tools' },
  { id: 'subscription', label: '会员', icon: 'fas fa-crown', href: '/subscription' },
  { id: 'profile', label: '我的', icon: 'fas fa-user', href: '/profile' },
];

export default function TabBar({ className = '' }: TabBarProps) {
  const pathname = usePathname();

  return (
    <div className={`tab-bar fixed bottom-0 left-0 right-0 h-20 flex items-center justify-around z-40 bg-white/80 backdrop-blur-lg border-t border-slate-200/50 ${className}`}>
      {tabs.map((tab) => {
        // 特殊逻辑：工具页面激活条件
        let isActive = false;
        if (tab.id === 'home') {
          isActive = pathname === '/' || pathname === '/home';
        } else if (tab.id === 'tools') {
          // 工具页面包含所有工具相关的子页面
          isActive = pathname === '/tools' || 
                    pathname.startsWith('/image-gen') || 
                    pathname.startsWith('/audio-gen') || 
                    pathname.startsWith('/video-gen') ||
                    pathname.startsWith('/tools');
        } else {
          isActive = pathname === tab.href;
        }
        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 touch-manipulation ${
              isActive
                ? 'text-primary bg-gradient-to-t from-primary/15 to-primary/10 border border-primary/20 shadow-md transform scale-105'
                : 'text-slate-500 hover:text-primary hover:bg-slate-100 active:scale-95'
            }`}
          >
            <i className={`${tab.icon} text-xl mb-1 transition-transform ${isActive ? 'scale-110' : ''}`}></i>
            <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
              {tab.label}
            </span>
            {/* 激活指示器 */}
            {isActive && (
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
            )}
          </Link>
        );
      })}
    </div>
  );
}