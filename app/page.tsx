'use client';

import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomePage() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full flex-1 flex flex-col justify-center">
        {/* 品牌Logo区域 */}
        <div className="text-center mb-6">
          {/* SVG Logo动画 */}
          <svg className="w-32 h-32 mx-auto mb-3 animate-bounce" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b"/>
                <stop offset="100%" stopColor="#fbbf24"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="40" stroke="url(#logoGrad)" strokeWidth="3" fill="none" strokeLinecap="round">
              <animate attributeName="r" values="35;40;35" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="stroke-width" values="2;3;2" dur="2s" repeatCount="indefinite"/>
            </circle>
            <text x="50" y="55" textAnchor="middle" fill="url(#logoGrad)" fontSize="16" fontWeight="bold" fontFamily="Poppins">iFlow</text>
          </svg>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            OpenAIGC
          </h1>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            今天你iFlow了吗？
          </p>
        </div>

        {/* 登录状态显示 */}
        {isAuthenticated && user && (
          <div className="glass rounded-2xl p-4 mb-6 text-center">
            <p className="text-slate-600">欢迎回来，</p>
            <p className="text-xl font-bold text-slate-800">{user.name}</p>
          </div>
        )}

        {/* 功能介绍卡片 */}
        <div className="space-y-4 mb-6">
          {/* 图像生成 - 左对齐 */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-palette text-white"></i>
              </div>
              <h3 className="font-semibold text-slate-800">图像生成</h3>
            </div>
            <p className="text-sm text-slate-600">AI驱动的一键图像创作</p>
          </div>
          
          {/* 音频合成 - 内容右对齐，卡片全宽 */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-end mb-3">
              <h3 className="font-semibold text-slate-800 mr-3">音频合成</h3>
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                <i className="fas fa-music text-white"></i>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">智能语音和音乐创作</p>
            </div>
          </div>
          
          {/* 视频制作 - 左对齐 */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-video text-white"></i>
              </div>
              <h3 className="font-semibold text-slate-800">视频制作</h3>
            </div>
            <p className="text-sm text-slate-600">专业级AI视频生成</p>
          </div>
        </div>

        {/* 认证状态按钮 */}
        {isAuthenticated ? (
          <Link href="/home">
            <button className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <span>进入应用</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </Link>
        ) : (
          <Link href="/auth/login">
            <button className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
              <span>开启iFlow之旅</span>
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </Link>
        )}
        
        {/* Powered by */}
        <div className="text-center mt-4">
          <p className="text-sm text-slate-500">
            Powered by iFlow CLI
          </p>
        </div>
      </div>
    </div>
  );
}