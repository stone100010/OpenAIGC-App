'use client';

import { useState } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';

export default function VideoGenPage() {
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('10');
  const [style, setStyle] = useState('realistic');
  const [resolution, setResolution] = useState('1080p');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!description.trim()) {
      return;
    }
    
    setIsGenerating(true);
    setGeneratedVideo(null);
    
    setTimeout(() => {
      // 模拟生成的视频URL
      setGeneratedVideo('https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4');
      setIsGenerating(false);
    }, 5000);
  };

  const durations = [
    { value: '5', label: '5秒' },
    { value: '10', label: '10秒' },
    { value: '15', label: '15秒' },
    { value: '30', label: '30秒' },
    { value: '60', label: '60秒' }
  ];

  const styles = [
    { value: 'realistic', label: '写实风格' },
    { value: 'cinematic', label: '电影风格' },
    { value: 'cartoon', label: '卡通风格' },
    { value: 'anime', label: '动漫风格' },
    { value: 'documentary', label: '纪录片风格' },
    { value: 'commercial', label: '广告风格' }
  ];

  const resolutions = [
    { value: '720p', label: '720p' },
    { value: '1080p', label: '1080p' },
    { value: '4k', label: '4K' }
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center">
            <i className="fas fa-video mr-4 text-purple-500 text-4xl"></i>
            AI视频生成
          </h1>
          <p className="text-slate-600 text-lg">将您的创意转化为动态视频内容</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：主要控制区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 生成控制面板 */}
            <GlassCard className="hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-6">
                {/* 文本输入区域 */}
                <div>
                  <label className="block text-lg font-semibold text-slate-800 mb-3">
                    视频描述
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all text-base"
                    placeholder="详细描述您想要的视频内容、场景、动作等..."
                  />
                </div>

                {/* 生成参数设置 - 三个下拉列表横向排布 */}
                <div>
                  <div className="grid grid-cols-3 gap-2">
                    {/* 时长选择 */}
                    <div className="relative">
                      <select
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer text-sm text-center"
                      >
                        {durations.map((d) => (
                          <option key={d.value} value={d.value}>
                            {d.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
                      </div>
                    </div>

                    {/* 风格选择 */}
                    <div className="relative">
                      <select
                        value={style}
                        onChange={(e) => setStyle(e.target.value)}
                        className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer text-sm text-center"
                      >
                        {styles.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
                      </div>
                    </div>

                    {/* 分辨率选择 */}
                    <div className="relative">
                      <select
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all appearance-none cursor-pointer text-sm text-center"
                      >
                        {resolutions.map((r) => (
                          <option key={r.value} value={r.value}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !description.trim()}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                      isGenerating || !description.trim()
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        生成中...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-play mr-2"></i>
                        生成视频
                      </>
                    )}
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* 生成结果展示 */}
            {(generatedVideo || isGenerating) && (
              <GlassCard className="hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">生成结果</h3>
                  
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-600 mb-2">正在生成中...</p>
                      <p className="text-sm text-slate-500">视频生成需要较长时间，请耐心等待</p>
                      <div className="mt-4 w-full max-w-md bg-slate-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full w-1/3 animate-pulse" style={{animationDuration: '2s'}}></div>
                      </div>
                    </div>
                  ) : generatedVideo ? (
                    <div className="space-y-4">
                      {/* 视频播放器 */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl overflow-hidden">
                        <div className="aspect-video bg-black relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <i className="fas fa-play text-white text-6xl cursor-pointer hover:scale-110 transition-transform"></i>
                          </div>
                          {/* 视频控制条 */}
                          <div className="absolute bottom-4 left-4 right-4">
                            <div className="flex items-center space-x-4">
                              <button className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors">
                                <i className="fas fa-play text-sm"></i>
                              </button>
                              <div className="flex-1">
                                <div className="w-full bg-white/20 rounded-full h-1">
                                  <div className="bg-purple-400 h-1 rounded-full w-0"></div>
                                </div>
                              </div>
                              <span className="text-white text-xs">00:15 / {duration}秒</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 视频信息 */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-medium text-slate-800 mb-2">视频信息</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-600">描述:</span>
                            <span className="ml-2 font-medium text-slate-800">{description}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">风格:</span>
                            <span className="ml-2 font-medium text-slate-800">{styles.find(s => s.value === style)?.label}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">时长:</span>
                            <span className="ml-2 font-medium text-slate-800">{duration}秒</span>
                          </div>
                          <div>
                            <span className="text-slate-600">分辨率:</span>
                            <span className="ml-2 font-medium text-slate-800">{resolution}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex gap-3">
                        <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                          <i className="fas fa-download mr-2"></i>
                          下载
                        </button>
                        <button className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                          <i className="fas fa-share mr-2"></i>
                          分享
                        </button>
                        <button className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                          <i className="fas fa-heart mr-2"></i>
                          收藏
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </GlassCard>
            )}
          </div>

          {/* 右侧：视频模板库 */}
          <div>
            <GlassCard className="h-full hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">视频模板</h3>
              <div className="space-y-4">
                {[
                  { 
                    title: '产品展示', 
                    desc: '现代产品360度展示，专业拍摄手法', 
                    duration: '10秒',
                    thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&w=300&h=200&fit=crop'
                  },
                  { 
                    title: '风景延时', 
                    desc: '自然风光延时摄影，壮丽美景', 
                    duration: '15秒',
                    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=300&h=200&fit=crop'
                  },
                  { 
                    title: '人物介绍', 
                    desc: '专业人物展示视频，商务风格', 
                    duration: '30秒',
                    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&w=300&h=200&fit=crop'
                  },
                  { 
                    title: '动画短片', 
                    desc: '卡通动画风格，生动有趣', 
                    duration: '20秒',
                    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&w=300&h=200&fit=crop'
                  }
                ].map((template, index) => (
                  <div 
                    key={index} 
                    className="group cursor-pointer p-4 bg-slate-50 hover:bg-purple-50 rounded-xl transition-colors duration-300"
                    onClick={() => setDescription(template.desc)}
                  >
                    <div className="flex items-center mb-3">
                      <div className="relative w-16 h-10 bg-slate-200 rounded-lg overflow-hidden mr-3">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <i className="fas fa-play text-slate-500 text-xs"></i>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 group-hover:text-purple-600">
                          {template.title}
                        </h4>
                        <p className="text-xs text-slate-500">{template.duration}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{template.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* 核心功能 */}
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 智能视频生成 */}
            <div className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-purple-800 mb-3">智能视频生成</h4>
                <p className="text-purple-700 text-sm mb-4 leading-relaxed">基于先进AI技术，从文字描述快速生成高质量视频内容</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-purple-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>文字转视频技术</span>
                  </div>
                  <div className="flex items-center text-xs text-purple-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>场景智能合成</span>
                  </div>
                  <div className="flex items-center text-xs text-purple-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>动作流畅自然</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 多样化风格 */}
            <div className="group">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-pink-800 mb-3">多样化风格</h4>
                <p className="text-pink-700 text-sm mb-4 leading-relaxed">6种专业视频风格可选，满足不同场景和需求</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">写实风格</span>
                  <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">电影风格</span>
                  <span className="bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs font-medium">卡通风格</span>
                </div>
                <div className="text-xs text-pink-600">
                  <i className="fas fa-plus-circle mr-1"></i>
                  <span>持续更新更多风格</span>
                </div>
              </div>
            </div>

            {/* 高清视频输出 */}
            <div className="group">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-indigo-800 mb-3">高清视频输出</h4>
                <p className="text-indigo-700 text-sm mb-4 leading-relaxed">支持多种分辨率输出，满足不同平台需求</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-600">720p HD</span>
                    <span className="font-medium text-indigo-800">1280×720</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-600">1080p FHD</span>
                    <span className="font-medium text-indigo-800">1920×1080</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-indigo-600">4K Ultra HD</span>
                    <span className="font-medium text-indigo-800">3840×2160</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab导航 */}
      <TabBar />
    </div>
  );
}