'use client';

import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth';
import {
  Image,
  Music,
  Video,
  Wand2,
  PenTool,
  Code,
  Users,
  Radio,
  User,
  ArrowRight,
  Clock,
  Lightbulb,
  Flame,
  Sparkles,
  Lock
} from 'lucide-react';

// 图标映射
const iconMap = {
  'image-gen': Image,
  'audio-gen': Music,
  'video-gen': Video,
  'image-edit': Wand2,
  'text-gen': PenTool,
  'code-gen': Code,
  'meeting-notes': Users,
  'radio-podcast': Radio,
  'digital-human': User,
};

const tools = [
  {
    id: 'image-gen',
    title: '图像生成',
    description: '文本转精美图片，AI艺术创作工具，让想象力变为现实',
    href: '/image-gen',
    color: 'from-blue-500 to-purple-600',
    bgImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['文本生图', '风格转换', '高清输出'],
    stats: '10M+ 图片',
    isHot: true,
    isNew: false,
    comingSoon: false
  },
  {
    id: 'audio-gen',
    title: '音频合成',
    description: '语音生成与编辑，智能配音工具，打造完美音频体验',
    href: '/audio-gen',
    color: 'from-emerald-500 to-cyan-600',
    bgImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['语音合成', '音乐生成', '音效制作'],
    stats: '500K+ 音频',
    isHot: false,
    isNew: true,
    comingSoon: true
  },
  {
    id: 'video-gen',
    title: '视频生成',
    description: '动态视频一键生成，AI视频创作，专业级影视制作',
    href: '/video-gen',
    color: 'from-purple-500 to-pink-600',
    bgImage: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['文本转视频', '图像动画', '特效处理'],
    stats: '100K+ 视频',
    isHot: true,
    isNew: false,
    comingSoon: true
  },
  {
    id: 'image-edit',
    title: '图像编辑',
    description: '智能图像编辑与处理，一键美化您的创意作品',
    href: '#',
    color: 'from-orange-500 to-red-600',
    bgImage: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['AI美颜', '背景替换', '风格迁移'],
    stats: '2M+ 处理',
    isHot: false,
    isNew: false,
    comingSoon: true
  },
  {
    id: 'text-gen',
    title: '文案生成',
    description: '智能文案创作助手，激发无限创意灵感',
    href: '/text-gen',
    color: 'from-indigo-500 to-blue-600',
    bgImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['广告文案', '小说创作', '内容策划'],
    stats: '5M+ 文案',
    isHot: false,
    isNew: true,
    comingSoon: false
  },
  {
    id: 'code-gen',
    title: '代码生成',
    description: 'AI编程助手，快速生成高质量代码',
    href: '/code-gen',
    color: 'from-gray-600 to-gray-800',
    bgImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['代码补全', '算法优化', '文档生成'],
    stats: '1M+ 代码',
    isHot: false,
    isNew: true,
    comingSoon: false
  },
  {
    id: 'meeting-notes',
    title: '会议纪要',
    description: '智能会议记录与总结，自动生成专业会议纪要',
    href: '/meeting-notes',
    color: 'from-purple-500 to-indigo-600',
    bgImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['语音转文字', '智能摘要', '行动项提取'],
    stats: '50K+ 会议',
    isHot: false,
    isNew: true,
    comingSoon: true
  },
  {
    id: 'radio-podcast',
    title: '电台播客',
    description: 'AI播客制作工具，智能生成电台节目和播客内容',
    href: '/radio-podcast',
    color: 'from-orange-500 to-red-600',
    bgImage: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['智能播报', '音效合成', '多声线选择'],
    stats: '200K+ 节目',
    isHot: true,
    isNew: true,
    comingSoon: true
  },
  {
    id: 'digital-human',
    title: '数字人',
    description: '虚拟数字人创建，打造专属AI虚拟主播',
    href: '/digital-human',
    color: 'from-teal-500 to-cyan-600',
    bgImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=225&q=80',
    features: ['虚拟形象', '语音合成', '表情动作'],
    stats: '10K+ 数字人',
    isHot: false,
    isNew: true,
    comingSoon: true
  }
];

function ToolsContent() {
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
          {tools.map((tool) => {
            const IconComponent = iconMap[tool.id as keyof typeof iconMap];
            const CardWrapper = tool.comingSoon ? 'div' : Link;
            const cardProps = tool.comingSoon ? {} : { href: tool.href };

            return (
              <CardWrapper key={tool.id} {...cardProps as any}>
                <div className={`group glass rounded-2xl overflow-hidden transition-all duration-300 h-full ${
                  tool.comingSoon
                    ? 'cursor-not-allowed opacity-75'
                    : 'cursor-pointer hover:shadow-2xl transform hover:-translate-y-2'
                }`}>
                  {/* 16:9 比例的图片区域 */}
                  <div className="relative aspect-video overflow-hidden">
                    <div
                      className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 ${
                        tool.comingSoon ? '' : 'group-hover:scale-110'
                      } ${tool.comingSoon ? 'grayscale' : ''}`}
                      style={{ backgroundImage: `url(${tool.bgImage})` }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} ${
                      tool.comingSoon
                        ? 'opacity-60'
                        : 'opacity-80 group-hover:opacity-70'
                    } transition-opacity duration-300`} />

                    {/* 即将上线遮罩 */}
                    {tool.comingSoon && (
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                          <Lock className="w-4 h-4 text-slate-600" />
                          <span className="text-slate-700 font-medium text-sm">敬请期待</span>
                        </div>
                      </div>
                    )}

                    {/* 图标覆盖层 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform duration-300 ${
                        tool.comingSoon ? '' : 'group-hover:scale-110'
                      }`}>
                        {IconComponent && <IconComponent className="w-7 h-7 text-white" />}
                      </div>
                    </div>

                    {/* 统计信息 */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                        {tool.stats}
                      </span>
                    </div>

                    {/* 热门/新品标签 */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      {tool.isHot && (
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg animate-pulse">
                          <Flame className="w-3 h-3" />
                          HOT
                        </span>
                      )}
                      {tool.isNew && (
                        <span className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
                          <Sparkles className="w-3 h-3" />
                          NEW
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 内容区域 */}
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-3 flex items-center ${
                      tool.comingSoon
                        ? 'text-slate-500'
                        : 'text-slate-800 group-hover:text-primary'
                    } transition-colors`}>
                      {tool.title}
                      <ArrowRight className={`w-5 h-5 ml-auto transition-all ${
                        tool.comingSoon
                          ? 'text-slate-300'
                          : 'text-slate-400 group-hover:text-primary group-hover:translate-x-1'
                      }`} />
                    </h3>

                    <p className={`mb-4 leading-relaxed text-sm ${
                      tool.comingSoon ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {tool.description}
                    </p>

                    {/* 功能特点 - 简化版 */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tool.features.slice(0, 2).map((feature, index) => (
                        <span key={index} className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tool.comingSoon
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {feature}
                        </span>
                      ))}
                      {tool.features.length > 2 && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          tool.comingSoon
                            ? 'bg-slate-100 text-slate-400'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          +{tool.features.length - 2}更多
                        </span>
                      )}
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex items-center justify-between">
                      <button
                        className={`font-semibold py-2 px-4 rounded-lg shadow-md text-sm transition-all duration-300 ${
                          tool.comingSoon
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : `bg-gradient-to-r ${tool.color} text-white hover:shadow-lg transform hover:scale-105`
                        }`}
                        disabled={tool.comingSoon}
                      >
                        {tool.comingSoon ? '即将上线' : '开始创作'}
                      </button>
                      <div className={`flex items-center text-sm ${
                        tool.comingSoon ? 'text-slate-400' : 'text-slate-500'
                      }`}>
                        <Clock className="w-4 h-4 mr-1" />
                        <span>快速上手</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardWrapper>
            );
          })}
        </div>

        {/* 底部提示 */}
        <div className="mt-16 text-center">
          <GlassCard className="max-w-2xl mx-auto">
            <div className="text-center">
              <Lightbulb className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
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

export default function ToolsPage() {
  return (
    <ProtectedRoute>
      <ToolsContent />
    </ProtectedRoute>
  );
}