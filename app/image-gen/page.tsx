'use client';

import { useState } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';

const styles = [
  { id: 'realistic', name: '写实风格', icon: 'fas fa-camera' },
  { id: 'anime', name: '动漫风格', icon: 'fas fa-palette' },
  { id: 'artistic', name: '艺术风格', icon: 'fas fa-paint-brush' },
  { id: 'abstract', name: '抽象风格', icon: 'fas fa-shapes' },
  { id: 'watercolor', name: '水彩风格', icon: 'fas fa-tint' },
  { id: 'oil-painting', name: '油画风格', icon: 'fas fa-palette' },
  { id: 'sketch', name: '素描风格', icon: 'fas fa-pencil-alt' },
  { id: 'pixel-art', name: '像素艺术', icon: 'fas fa-th' },
  { id: 'cyberpunk', name: '赛博朋克', icon: 'fas fa-robot' },
  { id: 'vintage', name: '复古风格', icon: 'fas fa-clock' },
  { id: 'minimalist', name: '极简主义', icon: 'fas fa-square' },
  { id: 'surrealist', name: '超现实主义', icon: 'fas fa-eye' }
];

const qualityOptions = [
  { id: 'standard', name: '标准质量', description: '快速生成，适合预览' },
  { id: 'high', name: '高质量', description: '平衡质量与速度' },
  { id: 'ultra', name: '超高质量', description: '最佳质量，生成时间较长' }
];

const sizeOptions = [
  { id: '1:1', name: '1:1', width: 512, height: 512 },
  { id: '2:3', name: '2:3', width: 512, height: 768 },
  { id: '3:2', name: '3:2', width: 768, height: 512 },
  { id: '3:4', name: '3:4', width: 512, height: 682 },
  { id: '4:3', name: '4:3', width: 682, height: 512 },
  { id: '16:9', name: '16:9', width: 768, height: 432 },
  { id: '9:16', name: '9:16', width: 432, height: 768 }
];

const inspirationGallery = [
  {
    id: 1,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    title: '未来城市景观',
    prompt: '梦幻的未来城市，日落时分，霓虹灯闪烁'
  },
  {
    id: 2,
    src: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    title: '星空探索',
    prompt: '太空中的彩色星云，璀璨夺目'
  },
  {
    id: 3,
    src: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    title: '自然美景',
    prompt: '深林中的发光蘑菇夜晚'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&w=300&h=300&fit=crop',
    title: '抽象艺术',
    prompt: '现代抽象艺术，色彩丰富'
  }
];

const prompts = [
  '梦幻的未来城市，日落时分，霓虹灯闪烁',
  '深林中的发光蘑菇夜晚，神秘而美丽',
  '太空中的彩色星云，璀璨夺目的宇宙',
  '古老图书馆的神秘氛围，书香气息',
  '水下宫殿的奇幻景观，海底世界',
  '春日花园的温暖阳光，花朵盛开'
];

export default function ImageGenPage() {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('realistic');
  const [selectedQuality, setSelectedQuality] = useState('high');
  const [selectedSize, setSelectedSize] = useState('1:1');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleRandomPrompt = () => {
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setPrompt(randomPrompt);
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      return;
    }
    
    setIsGenerating(true);
    setGeneratedImage(null);
    
    // 模拟生成过程
    setTimeout(() => {
      // 随机选择一张模拟生成的图片
      const mockImages = [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1536240478700-b869070f9279?ixlib=rb-4.0.3&w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&w=800&h=800&fit=crop'
      ];
      
      const randomImage = mockImages[Math.floor(Math.random() * mockImages.length)];
      setGeneratedImage(randomImage);
      setIsGenerating(false);
    }, 3000);
  };

  const handleGalleryClick = (item: any) => {
    setPrompt(item.prompt);
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center">
            <i className="fas fa-image mr-4 text-blue-500 text-4xl"></i>
            AI图像生成
          </h1>
          <p className="text-slate-600 text-lg">用文字描述您的创意，AI为您创作精美图像</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：输入区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 生成控制面板 */}
            <GlassCard className="hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-6">
                {/* 文本输入区域 */}
                <div>
                  <label className="block text-lg font-semibold text-slate-800 mb-3">
                    描述您的创意
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all text-base"
                    placeholder="详细描述您想要的图像内容、场景、风格等..."
                  />
                </div>

                {/* 生成参数设置 - 手机端紧凑排布 */}
                <div>
                  <div className="grid grid-cols-3 gap-2">
                    {/* 风格选择 */}
                    <div className="relative">
                      <select
                        value={selectedStyle}
                        onChange={(e) => setSelectedStyle(e.target.value)}
                        className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none cursor-pointer text-sm text-center"
                      >
                        {styles.map((style) => (
                          <option key={style.id} value={style.id}>
                            {style.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
                      </div>
                    </div>

                    {/* 质量选择 */}
                    <div className="relative">
                      <select
                        value={selectedQuality}
                        onChange={(e) => setSelectedQuality(e.target.value)}
                        className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none cursor-pointer text-sm text-center"
                      >
                        {qualityOptions.map((quality) => (
                          <option key={quality.id} value={quality.id}>
                            {quality.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
                      </div>
                    </div>

                    {/* 尺寸选择 */}
                    <div className="relative">
                      <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all appearance-none cursor-pointer text-sm text-center"
                      >
                        {sizeOptions.map((size) => (
                          <option key={size.id} value={size.id}>
                            {size.name}
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
                <div className="flex gap-4">
                  <button
                    onClick={handleRandomPrompt}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                  >
                    <i className="fas fa-random mr-2"></i>
                    随机灵感
                  </button>
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className={`flex-1 font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center ${
                      isGenerating || !prompt.trim()
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        生成中...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-magic mr-2"></i>
                        生成图像
                      </>
                    )}
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* 生成结果展示 */}
            {(generatedImage || isGenerating) && (
              <GlassCard className="hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">生成结果</h3>
                  
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-600 mb-2">正在生成中...</p>
                      <p className="text-sm text-slate-500">请稍候，这可能需要几秒钟</p>
                    </div>
                  ) : generatedImage ? (
                    <div className="space-y-4">
                      <div className="relative">
                        <Image
                          src={generatedImage}
                          alt="生成的图像"
                          width={800}
                          height={800}
                          className="w-full max-w-md mx-auto rounded-xl shadow-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            <i className="fas fa-check mr-1"></i>
                            生成完成
                          </span>
                        </div>
                      </div>
                      
                      {/* 图像信息 */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-medium text-slate-800 mb-2">生成参数</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-600">描述:</span>
                            <span className="ml-2 font-medium text-slate-800">{prompt}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">风格:</span>
                            <span className="ml-2 font-medium text-slate-800">{styles.find(s => s.id === selectedStyle)?.name}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">质量:</span>
                            <span className="ml-2 font-medium text-slate-800">{qualityOptions.find(q => q.id === selectedQuality)?.name}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">尺寸:</span>
                            <span className="ml-2 font-medium text-slate-800">{selectedSize}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex gap-3">
                        <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                          <i className="fas fa-download mr-2"></i>
                          下载
                        </button>
                        <button className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                          <i className="fas fa-share mr-2"></i>
                          分享
                        </button>
                        <button className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
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

          {/* 右侧：灵感画廊 */}
          <div>
            <GlassCard className="h-full hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">灵感画廊</h3>
              <div className="space-y-4">
                {inspirationGallery.map((item) => (
                  <div 
                    key={item.id} 
                    className="group cursor-pointer"
                    onClick={() => handleGalleryClick(item)}
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <Image
                        src={item.src}
                        alt={item.title}
                        width={300}
                        height={300}
                        className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                        <i className="fas fa-plus text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-2xl"></i>
                      </div>
                    </div>
                    <div className="mt-3">
                      <h4 className="font-medium text-slate-800 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-600 line-clamp-2">{item.prompt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* 核心功能 */}
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 智能生成 */}
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-blue-800 mb-3">智能生成</h4>
                <p className="text-blue-700 text-sm mb-4 leading-relaxed">基于先进的深度学习算法，精准理解您的创意描述，生成高质量图像作品</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-blue-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>文本理解准确率99%</span>
                  </div>
                  <div className="flex items-center text-xs text-blue-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>3秒内快速生成</span>
                  </div>
                  <div className="flex items-center text-xs text-blue-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>支持中文提示词</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 多样风格 */}
            <div className="group">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-emerald-800 mb-3">多样风格</h4>
                <p className="text-emerald-700 text-sm mb-4 leading-relaxed">涵盖写实、动漫、艺术、抽象等多种风格，满足不同场景和需求</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">写实风格</span>
                  <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">动漫风格</span>
                  <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">艺术风格</span>
                </div>
                <div className="text-xs text-emerald-600">
                  <i className="fas fa-plus-circle mr-1"></i>
                  <span>持续更新更多风格</span>
                </div>
              </div>
            </div>

            {/* 高清导出 */}
            <div className="group">
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-orange-800 mb-3">高清导出</h4>
                <p className="text-orange-700 text-sm mb-4 leading-relaxed">支持4K超高清分辨率导出，适合印刷和商业使用</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-600">分辨率</span>
                    <span className="font-medium text-orange-800">4K (3840×2160)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-600">格式</span>
                    <span className="font-medium text-orange-800">PNG / JPG</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-orange-600">色彩</span>
                    <span className="font-medium text-orange-800">24位真彩</span>
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