'use client';

import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Link from 'next/link';

const tools = [
  {
    id: 'image-gen',
    title: '图像生成',
    description: '文本转精美图片，AI艺术创作工具，让想象力变为现实',
    icon: 'fas fa-image',
    href: '/image-gen',
    color: 'from-blue-500 to-purple-600',
    bgImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['文本生图', '风格转换', '高清输出'],
    stats: '10M+ 图片'
  },
  {
    id: 'audio-gen',
    title: '音频合成',
    description: '语音生成与编辑，智能配音工具，打造完美音频体验',
    icon: 'fas fa-music',
    href: '/audio-gen',
    color: 'from-emerald-500 to-cyan-600',
    bgImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['语音合成', '音乐生成', '音效制作'],
    stats: '500K+ 音频'
  },
  {
    id: 'video-gen',
    title: '视频生成',
    description: '动态视频一键生成，AI视频创作，专业级影视制作',
    icon: 'fas fa-video',
    href: '/video-gen',
    color: 'from-purple-500 to-pink-600',
    bgImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['文本转视频', '图像动画', '特效处理'],
    stats: '100K+ 视频'
  },
  {
    id: 'image-edit',
    title: '图像编辑',
    description: '智能图像编辑与处理，一键美化您的创意作品',
    icon: 'fas fa-magic',
    href: '#',
    color: 'from-orange-500 to-red-600',
    bgImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['AI美颜', '背景替换', '风格迁移'],
    stats: '2M+ 处理'
  },
  {
    id: 'text-gen',
    title: '文案生成',
    description: '智能文案创作助手，激发无限创意灵感',
    icon: 'fas fa-pen-fancy',
    href: '#',
    color: 'from-indigo-500 to-blue-600',
    bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['广告文案', '小说创作', '内容策划'],
    stats: '5M+ 文案'
  },
  {
    id: 'code-gen',
    title: '代码生成',
    description: 'AI编程助手，快速生成高质量代码',
    icon: 'fas fa-code',
    href: '#',
    color: 'from-gray-600 to-gray-800',
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['代码补全', '算法优化', '文档生成'],
    stats: '1M+ 代码'
  }
];

export default function ToolsPage() {
  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">AI工具箱</h1>
          <p className="text-slate-600 text-lg">一键生成创意内容，探索无限可能</p>
        </div>

        {/* 工具网格 - 16:9比例卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.id} href={tool.href}>
              <div className="group glass rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 h-full">
                {/* 16:9 比例的图片区域 */}
                <div className="relative aspect-video overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${tool.bgImage})` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-80 group-hover:opacity-70 transition-opacity duration-300`} />
                  
                  {/* 图标覆盖层 */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <i className={`${tool.icon} text-white text-2xl`}></i>
                    </div>
                  </div>
                  
                  {/* 统计信息 */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                      {tool.stats}
                    </span>
                  </div>
                </div>
                
                {/* 内容区域 */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary transition-colors flex items-center">
                    {tool.title}
                    <i className="fas fa-arrow-right ml-auto text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all"></i>
                  </h3>
                  
                  <p className="text-slate-600 mb-4 leading-relaxed text-sm">
                    {tool.description}
                  </p>

                  {/* 功能特点 - 简化版 */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tool.features.slice(0, 2).map((feature, index) => (
                      <span key={index} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                        {feature}
                      </span>
                    ))}
                    {tool.features.length > 2 && (
                      <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                        +{tool.features.length - 2}更多
                      </span>
                    )}
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex items-center justify-between">
                    <button className={`bg-gradient-to-r ${tool.color} text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 text-sm`}>
                      开始创作
                    </button>
                    <div className="flex items-center text-slate-500 text-sm">
                      <i className="fas fa-clock mr-1"></i>
                      <span>快速上手</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="mt-16 text-center">
          <GlassCard className="max-w-2xl mx-auto">
            <div className="text-center">
              <i className="fas fa-lightbulb text-4xl text-yellow-500 mb-4"></i>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">使用提示</h3>
              <p className="text-slate-600 leading-relaxed">
                选择任意工具开始您的AI创作之旅。每个工具都经过精心优化，提供专业级的创作体验。
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
      
      {/* Tab导航 */}
      <TabBar />
    </div>
  );
}