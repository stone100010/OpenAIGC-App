'use client';

import { useState, useEffect } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import { ProtectedRoute } from '@/components/auth';

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

function AudioGenContent() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('nova');
  const [speed, setSpeed] = useState('normal');
  const [quality, setQuality] = useState('high');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedAudio, setGeneratedAudio] = useState<string | null>(null);
  const [generationProgress, setGenerationProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [duration, setDuration] = useState('00:00');

  // 清理函数：组件卸载时清理blob URL和停止TTS
  useEffect(() => {
    return () => {
      // 停止任何正在进行的TTS播放
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      
      // 清理blob URL
      if (generatedAudio && generatedAudio.startsWith('blob:')) {
        URL.revokeObjectURL(generatedAudio);
      }
    };
  }, [generatedAudio]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      return;
    }
    
    setIsGenerating(true);
    setGeneratedAudio(null);
    setError(null);
    setGenerationProgress('正在连接AI服务器...');
    
    try {
      // 使用API代理端点解决CORS问题
      const apiUrl = '/api/audio/generate';
      
      console.log('生成音频:', { text, voice, speed, quality, apiUrl });

      setGenerationProgress('正在生成语音...');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          voice,
          speed,
          quality
        })
      });

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
      }

      setGenerationProgress('正在处理音频...');

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || result.message || '生成失败');
      }

      setGeneratedAudio(result.audioUrl);
      setGenerationProgress('语音生成完成！');
      setIsGenerating(false);
      console.log('音频生成成功:', result.audioUrl, 'size:', result.size, 'type:', result.type);

    } catch (error) {
      console.warn('API调用失败，尝试使用免费备选方案:', error);
      
      // 使用免费的浏览器TTS API作为备选
      if (error instanceof Error && (error.message.includes('402') || error.message.includes('Payment Required'))) {
        await generateWithBrowserTTS();
      } else {
        console.warn('其他错误:', error);
        setError(error instanceof Error ? error.message : '生成过程中出现未知错误');
        setGenerationProgress('');
        setIsGenerating(false);
      }
    }
  };

  const generateWithBrowserTTS = async () => {
    try {
      setGenerationProgress('准备TTS语音生成...');
      
      // 创建一个假的音频URL来显示播放控制界面
      // TTS实际上是实时播放的，不生成文件
      const fakeAudioUrl = 'data:audio/wav;base64,';
      
      // 设置TTS文本，但不立即播放
      setGenerationProgress('TTS语音准备完成，请点击播放按钮播放');
      setGeneratedAudio(fakeAudioUrl);
      setIsGenerating(false);
      
    } catch (error) {
      console.error('TTS准备失败:', error);
      setError('TTS语音准备失败，请重试');
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedAudio) return;
    
    try {
      const response = await fetch(generatedAudio);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-audio-${Date.now()}.mp3`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
      alert('下载失败，请重试');
    }
  };

  const handleShare = () => {
    if (navigator.share && generatedAudio) {
      navigator.share({
        title: 'AI生成的语音',
        text: '我用iFlow AI生成了这段语音！',
        url: generatedAudio
      }).catch(console.error);
    } else if (generatedAudio) {
      // 降级方案：复制到剪贴板
      navigator.clipboard.writeText(generatedAudio).then(() => {
        alert('音频链接已复制到剪贴板');
      }).catch(() => {
        alert('分享功能不可用');
      });
    } else {
      alert('暂无可分享的内容');
    }
  };

  const handleFavorite = () => {
    // TODO: 实现收藏功能
    alert('收藏功能即将推出！');
  };

  const handlePlayPause = () => {
    // 检查是否是TTS音频（fakeAudioUrl以data:audio/wav;base64,开头）
    const isTTSAudio = generatedAudio && generatedAudio.startsWith('data:audio/wav;base64,');
    
    if (isTTSAudio) {
      // 处理TTS播放
      if (isPlaying) {
        // 停止TTS播放
        speechSynthesis.cancel();
        setIsPlaying(false);
        setCurrentTime('00:00');
      } else {
        // 开始TTS播放
        const utterance = new SpeechSynthesisUtterance(text);
        
        // 尝试选择合适的中文声音
        const voices = speechSynthesis.getVoices();
        const chineseVoice = voices.find(v => v.lang.includes('zh') || v.name.includes('Chinese'));
        if (chineseVoice) {
          utterance.voice = chineseVoice;
        }
        
        // 设置默认参数
        utterance.rate = 1.0;
        utterance.volume = 1.0;
        utterance.pitch = 1.0;

        // 设置TTS完成回调
        utterance.onend = () => {
          setIsPlaying(false);
          setCurrentTime('00:00');
        };

        utterance.onerror = (event) => {
          setError('TTS播放失败：' + event.error);
          setIsPlaying(false);
        };

        // 开始播放TTS
        speechSynthesis.speak(utterance);
        setIsPlaying(true);
      }
    } else {
      // 处理普通音频文件播放
      const audio = document.getElementById('audio-player') as HTMLAudioElement;
      if (audio) {
        if (isPlaying) {
          audio.pause();
        } else {
          audio.play();
        }
        setIsPlaying(!isPlaying);
      }
    }
  };

  const voices = [
    { value: 'nova', label: '温柔女声', description: '温暖、自然的女性声音，适合朗读和播报' },
    { value: 'alloy', label: '中性声音', description: '清晰、稳重的中性声音，适合各种场景' },
    { value: 'shimmer', label: '活泼女声', description: '年轻、有活力的女性声音，适合故事和对话' },
    { value: 'echo', label: '成熟男声', description: '深沉、权威的男性声音，适合正式场合' },
    { value: 'fable', label: '温和男声', description: '亲切、友好的男性声音，适合教学和介绍' },
    { value: 'onyx', label: '低沉男声', description: '厚重、低沉的男性声音，适合配音和朗读' }
  ];

  const speeds = [
    { value: '0.8', label: '慢速', description: '语速较慢，便于理解' },
    { value: '1.0', label: '正常', description: '自然语速，平衡清晰度' },
    { value: '1.2', label: '快速', description: '语速较快，适合快速阅读' }
  ];

  const qualities = [
    { value: 'standard', label: '标准音质', description: '128kbps，适合一般用途' },
    { value: 'high', label: '高质量', description: '256kbps，清晰度高' },
    { value: 'ultra', label: '超高质量', description: '320kbps，专业级音质' }
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

                {/* 生成参数设置 - 声音选择 */}
                <div>
                  <div className="relative">
                    <select
                      value={voice}
                      onChange={(e) => setVoice(e.target.value)}
                      className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all appearance-none cursor-pointer text-sm"
                    >
                      {[
                        { value: 'alloy', label: 'Alloy - 中性、专业' },
                        { value: 'echo', label: 'Echo - 深沉、浑厚' },
                        { value: 'fable', label: 'Fable - 故事讲述者' },
                        { value: 'onyx', label: 'Onyx - 温暖、丰富' },
                        { value: 'nova', label: 'Nova - 明亮、友好' },
                        { value: 'shimmer', label: 'Shimmer - 柔和、旋律' }
                      ].map((v) => (
                        <option key={v.value} value={v.value}>
                          {v.label}
                        </option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <i className="fas fa-chevron-down text-slate-400 text-xs"></i>
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
            {(generatedAudio || isGenerating || error) && (
              <GlassCard className="hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">生成结果</h3>
                  
                  {isGenerating ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-600 mb-2">正在生成中...</p>
                      <p className="text-sm text-slate-500 mb-2">{generationProgress}</p>
                      <p className="text-xs text-slate-400">通常需要5-15秒，请耐心等待</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                      </div>
                      <p className="text-red-600 mb-2">生成失败</p>
                      <p className="text-sm text-slate-600 mb-4 text-center max-w-md">{error}</p>
                      <button 
                        onClick={handleGenerate}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        重新尝试
                      </button>
                    </div>
                  ) : generatedAudio ? (
                    <div className="space-y-4">
                      {/* 音频播放器 */}
                      <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 rounded-xl p-6">
                        <div className="flex items-center justify-center mb-4">
                          <i 
                            className={`fas ${isPlaying ? 'fa-pause-circle' : 'fa-play-circle'} text-emerald-500 text-6xl cursor-pointer hover:scale-110 transition-transform`}
                            onClick={handlePlayPause}
                          ></i>
                        </div>
                        
                        {/* 隐藏的音频元素 */}
                        <audio 
                          id="audio-player"
                          src={generatedAudio}
                          onPlay={() => setIsPlaying(true)}
                          onPause={() => setIsPlaying(false)}
                          onLoadedMetadata={() => {
                            const audio = document.getElementById('audio-player') as HTMLAudioElement;
                            if (audio) {
                              const duration = audio.duration;
                              setDuration(formatTime(duration));
                            }
                          }}
                          onTimeUpdate={() => {
                            const audio = document.getElementById('audio-player') as HTMLAudioElement;
                            if (audio) {
                              setCurrentTime(formatTime(audio.currentTime));
                            }
                          }}
                          style={{ display: 'none' }}
                        ></audio>
                        
                        {/* 音频控制条 */}
                        <div className="space-y-4">
                          <div className="flex items-center space-x-4">
                            <button 
                              onClick={handlePlayPause}
                              className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white hover:bg-emerald-600 transition-colors"
                            >
                              <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
                            </button>
                            <div className="flex-1">
                              {generatedAudio && generatedAudio.startsWith('data:audio/wav;base64,') ? (
                                <div className="text-center text-sm text-slate-600 py-2">
                                  <span className="text-amber-600 font-medium">TTS实时语音</span>
                                  <p className="text-xs text-slate-500 mt-1">点击播放按钮开始/暂停TTS语音</p>
                                </div>
                              ) : (
                                <>
                                  <div className="flex justify-between text-sm text-slate-600 mb-1">
                                    <span>{currentTime}</span>
                                    <span>{duration}</span>
                                  </div>
                                  <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-emerald-500 h-2 rounded-full w-0" style={{width: '0%'}}></div>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* 音频信息 */}
                      <div className="bg-slate-50 rounded-lg p-4">
                        <h4 className="font-medium text-slate-800 mb-2">
                          {generatedAudio && generatedAudio.startsWith('data:audio/wav;base64,') ? 'TTS信息' : '音频信息'}
                        </h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          <div>
                            <span className="text-slate-600">文本:</span>
                            <span className="ml-2 font-medium text-slate-800">{text}</span>
                          </div>
                          <div>
                            <span className="text-slate-600">声音:</span>
                            <span className="ml-2 font-medium text-slate-800">{voices.find(v => v.value === voice)?.label}</span>
                          </div>
                          {generatedAudio && generatedAudio.startsWith('data:audio/wav;base64,') ? (
                            <>
                              <div>
                                <span className="text-slate-600">类型:</span>
                                <span className="ml-2 font-medium text-slate-800">浏览器TTS</span>
                              </div>
                              <div>
                                <span className="text-slate-600">状态:</span>
                                <span className="ml-2 font-medium text-slate-800 text-amber-600">免费版本</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>
                                <span className="text-slate-600">语速:</span>
                                <span className="ml-2 font-medium text-slate-800">{speeds.find(s => s.value === speed)?.label}</span>
                              </div>
                              <div>
                                <span className="text-slate-600">音质:</span>
                                <span className="ml-2 font-medium text-slate-800">{qualities.find(q => q.value === quality)?.label}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* 操作按钮 */}
                      <div className="flex gap-3">
                        {!(generatedAudio && generatedAudio.startsWith('data:audio/wav;base64,')) && (
                          <button 
                            onClick={handleDownload}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            <i className="fas fa-download mr-2"></i>
                            下载
                          </button>
                        )}
                        <button 
                          onClick={handleShare}
                          className={`${generatedAudio && generatedAudio.startsWith('data:audio/wav;base64,') ? 'flex-1' : 'flex-1'} bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors`}
                        >
                          <i className="fas fa-share mr-2"></i>
                          分享
                        </button>
                        <button 
                          onClick={handleFavorite}
                          className={`${generatedAudio && generatedAudio.startsWith('data:audio/wav;base64,') ? 'flex-1' : 'flex-1'} bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors`}
                        >
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

export default function AudioGenPage() {
  return (
    <ProtectedRoute>
      <AudioGenContent />
    </ProtectedRoute>
  );
}