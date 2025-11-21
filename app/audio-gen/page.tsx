'use client';

import { useState } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';

export default function AudioGenPage() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('female-1');
  const [speed, setSpeed] = useState('normal');
  const [quality, setQuality] = useState('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!text.trim()) {
      return;
    }
    
    setIsGenerating(true);
    setGeneratedAudio(null);
    
    setTimeout(() => {
      // 模拟生成的音频URL
      setGeneratedAudio('https://www.soundjay.com/misc/sounds/bell-ringing-05.wav');
      setIsGenerating(false);
    }, 3000);
  };

  const voices = [
    { value: 'female-1', label: '温柔女声' },
    { value: 'male-1', label: '成熟男声' },
    { value: 'female-2', label: '活泼女声' },
    { value: 'male-2', label: '青年男声' },
    { value: 'child', label: '儿童声音' },
    { value: 'elder', label: '老年声音' }
  ];

  const speeds = [
    { value: 'slow', label: '慢速' },
    { value: 'normal', label: '正常' },
    { value: 'fast', label: '快速' }
  ];

  const qualities = [
    { value: 'standard', label: '标准' },
    { value: 'high', label: '高质量' },
    { value: 'ultra', label: '超高质量' }
  ];

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center">
            <i className="fas fa-music mr-4 text-emerald-500 text-4xl"></i>
            AI音频生成
          </h1>
          <p className="text-slate-600 text-lg">将文字转换为自然流畅的语音</p>
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
                    输入文本
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all text-base"
                    placeholder="输入您想要转换为语音的文字内容..."
                  />
                </div>

                {/* 生成参数设置 - 三个下拉列表横向排布 */}
                <div>
                  <div className="grid grid-cols-3 gap-2">
                    {/* 声音选择 */}
                    <div className="relative">
                      <select
                        value={voice}
                        onChange={(e) => setVoice(e.target.value)}
                        className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all appearance-none cursor-pointer text-sm text-center"
                      >
                        {voices.map((v) => (
                          <option key={v.value} value={v.value}>
                            {v.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
                      </div>
                    </div>

                    {/* 语速选择 */}
                    <div className="relative">
                      <select
                        value={speed}
                        onChange={(e) => setSpeed(e.target.value)}
                        className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all appearance-none cursor-pointer text-sm text-center"
                      >
                        {speeds.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
                      </div>
                    </div>

                    {/* 音质选择 */}
                    <div className="relative">
                      <select
                        value={quality}
                        onChange={(e) => setQuality(e.target.value)}
                        className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all appearance-none cursor-pointer text-sm text-center"
                      >
                        {qualities.map((q) => (
                          <option key={q.value} value={q.value}>
                            {q.label}
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
                    disabled={isGenerating || !text.trim()}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                      isGenerating || !text.trim()
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-500 to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        生成中...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-microphone mr-2"></i>
                        生成语音
                      </>
                    )}
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* 生成结果展示 */}
            {(generatedAudio || isGenerating) && (
              <GlassCard className="hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">生成结果</h3>
                  
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-600 mb-2">正在生成中...</p>
                      <p className="text-sm text-slate-500">请稍候，这可能需要几秒钟</p>
                    </div>
                  ) : generatedAudio ? (
                    <div className="space-y-4">
                      {/* 音频播放器 */}
                      <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-6">
                        <div className="flex items-center justify-center mb-4">
                          <i className="fas fa-play-circle text-emerald-500 text-6xl cursor-pointer hover:scale-110 transition-transform"></i>
                        </div>
                        
                        {/* 音频控制条 */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <button className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors">
                              <i className="fas fa-play"></i>
                            </button>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm text-slate-600 mb-1">
                                <span>00:00</span>
                                <span>03:45</span>
                              </div>
                              <div className="w-full bg-slate-200 rounded-full h-2">
                                <div className="bg-emerald-500 h-2 rounded-full w-0"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 音频信息 */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-medium text-slate-800 mb-2">音频信息</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-slate-600">文本:</span>
                            <span className="ml-2 font-medium text-slate-800">{text}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">声音:</span>
                            <span className="ml-2 font-medium text-slate-800">{voices.find(v => v.value === voice)?.label}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">语速:</span>
                            <span className="ml-2 font-medium text-slate-800">{speeds.find(s => s.value === speed)?.label}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">音质:</span>
                            <span className="ml-2 font-medium text-slate-800">{qualities.find(q => q.value === quality)?.label}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex gap-3">
                        <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                          <i className="fas fa-download mr-2"></i>
                          下载
                        </button>
                        <button className="flex-1 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                          <i className="fas fa-share mr-2"></i>
                          分享
                        </button>
                        <button className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
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
              <h3 className="text-lg font-semibold text-slate-800 mb-6">音频模板</h3>
              <div className="space-y-4">
                {[
                  { title: '新闻播报', text: '今日头条新闻播报，科技改变生活...', duration: '02:30' },
                  { title: '故事朗读', text: '在一个遥远的王国里，住着一位善良的公主...', duration: '05:20' },
                  { title: '诗歌朗诵', text: '春风十里不如你，夏日荷花别样红...', duration: '03:15' },
                  { title: '产品介绍', text: '这款创新的产品将为您的日常生活带来便利...', duration: '01:45' }
                ].map((template, index) => (
                  <div 
                    key={index} 
                    className="group cursor-pointer p-4 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-colors duration-300"
                    onClick={() => setText(template.text)}
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                        <i className="fas fa-music text-white text-sm"></i>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 group-hover:text-emerald-600">
                          {template.title}
                        </h4>
                        <p className="text-xs text-slate-500">{template.duration}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{template.text}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* 核心功能 */}
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 智能语音 */}
            <div className="group">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-emerald-800 mb-3">智能语音</h4>
                <p className="text-emerald-700 text-sm mb-4 leading-relaxed">先进的语音合成技术，生成自然流畅的语音，支持情感表达</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-emerald-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>自然流畅语音</span>
                  </div>
                  <div className="flex items-center text-xs text-emerald-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>情感表达丰富</span>
                  </div>
                  <div className="flex items-center text-xs text-emerald-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>支持多种语言</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 声音库 */}
            <div className="group">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-cyan-800 mb-3">丰富声音库</h4>
                <p className="text-cyan-700 text-sm mb-4 leading-relaxed">6种不同音色可选，涵盖男女老少各种声音类型</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-cyan-200 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">温柔女声</span>
                  <span className="bg-cyan-200 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">成熟男声</span>
                  <span className="bg-cyan-200 text-cyan-800 px-2 py-1 rounded-full text-xs font-medium">活泼女声</span>
                </div>
                <div className="text-xs text-cyan-600">
                  <i className="fas fa-plus-circle mr-1"></i>
                  <span>持续更新更多声音</span>
                </div>
              </div>
            </div>

            {/* 高清音质 */}
            <div className="group">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-teal-800 mb-3">高清音质</h4>
                <p className="text-teal-700 text-sm mb-4 leading-relaxed">支持多种音质等级，满足不同场景的音频需求</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-teal-600">标准音质</span>
                    <span className="font-medium text-teal-800">128kbps</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-teal-600">高质量</span>
                    <span className="font-medium text-teal-800">256kbps</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-teal-600">超高质量</span>
                    <span className="font-medium text-teal-800">320kbps</span>
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