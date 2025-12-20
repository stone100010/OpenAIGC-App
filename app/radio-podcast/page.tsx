'use client';

import { useState } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import { ProtectedRoute } from '@/components/auth';
import {
  Radio,
  Play,
  Pause,
  Download,
  Share,
  Heart,
  Clock,
  Headphones
} from 'lucide-react';

interface PodcastEpisode {
  id: string;
  title: string;
  content: string;
  audioUrl: string;
  duration: string;
  voice: string;
  date: string;
}

function RadioPodcastContent() {
  const [episode, setEpisode] = useState<PodcastEpisode | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 简化的表单状态
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [voice, setVoice] = useState('professional');

  // 播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');
  const [totalTime, setTotalTime] = useState('00:00');

  const voiceOptions = [
    { value: 'professional', label: '专业男声' },
    { value: 'warm', label: '温暖女声' },
    { value: 'energetic', label: '活力男声' },
    { value: 'calm', label: '平静女声' }
  ];

  const formatTime = (minutes: number): string => {
    const mins = Math.floor(minutes);
    const secs = (minutes - mins) * 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGenerate = async () => {
    if (!title.trim() || !content.trim()) {
      setError('请填写标题和内容');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 调用电台播客API
      const response = await fetch('/api/radio-podcast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          voice
        }),
      });

      const result = await response.json();

      if (result.success) {
        setEpisode(result.data);
      } else {
        throw new Error(result.error || '生成失败');
      }

      setIsGenerating(false);

    } catch (error) {
      console.error('生成失败:', error);
      setError(error instanceof Error ? error.message : '生成播客节目时出现错误，请重试');
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!episode) return;
    
    const a = document.createElement('a');
    a.href = episode.audioUrl;
    a.download = `${episode.title}.mp3`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = () => {
    if (navigator.share && episode) {
      navigator.share({
        title: episode.title,
        text: episode.title,
        url: window.location.href
      }).catch(console.error);
    } else if (episode) {
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('链接已复制到剪贴板');
      }).catch(() => {
        alert('分享功能不可用');
      });
    }
  };

  const handleFavorite = () => {
    alert('收藏功能即将推出！');
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center">
            <Radio className="mr-4 text-orange-500 text-4xl" />
            电台播客
          </h1>
          <p className="text-slate-600 text-lg">快速生成播客节目</p>
        </div>

        {/* 输入表单 */}
        <GlassCard className="mb-8">
          <div className="space-y-6">
            {/* 标题输入 */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                播客标题
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all"
                placeholder="输入播客标题..."
              />
            </div>

            {/* 主播声音选择 */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                主播声音
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {voiceOptions.map((voiceOption) => (
                  <button
                    key={voiceOption.value}
                    onClick={() => setVoice(voiceOption.value)}
                    className={`p-3 rounded-lg border-2 transition-all text-center ${
                      voice === voiceOption.value
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-slate-200 hover:border-orange-300 text-slate-700'
                    }`}
                  >
                    <div className="font-medium text-sm">{voiceOption.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 内容输入 */}
            <div>
              <label className="block text-sm font-semibold text-slate-800 mb-2">
                播客内容
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 resize-none h-40 focus:outline-none focus:ring-2 focus:ring-orange-500/30 transition-all"
                placeholder="输入播客内容，AI将生成相应的音频..."
              />
            </div>

            {/* 生成按钮 */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !title.trim() || !content.trim()}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                isGenerating || !title.trim() || !content.trim()
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isGenerating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  生成中...
                </>
              ) : (
                <>
                  <Radio className="w-5 h-5 mr-2" />
                  开始生成
                </>
              )}
            </button>
          </div>
        </GlassCard>

        {/* 生成结果 */}
        {(episode || isGenerating || error) && (
          <GlassCard>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">生成结果</h3>
              
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-slate-600 mb-2">正在生成播客...</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <Radio className="w-8 h-8 text-red-500" />
                  </div>
                  <p className="text-red-600 mb-2">生成失败</p>
                  <p className="text-sm text-slate-600 mb-4">{error}</p>
                  <button 
                    onClick={handleGenerate}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    重新尝试
                  </button>
                </div>
              ) : episode ? (
                <div className="space-y-6">
                  {/* 播客信息 */}
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 text-left">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-slate-800">{episode.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-slate-600">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {episode.duration}
                        </span>
                        <span>{episode.date}</span>
                      </div>
                    </div>
                    
                    <div className="prose prose-sm max-w-none text-slate-700">
                      <div dangerouslySetInnerHTML={{ __html: episode.content.replace(/\n/g, '<br>') }} />
                    </div>
                  </div>

                  {/* 播放器 */}
                  <div className="bg-slate-50 rounded-xl p-6">
                    <div className="flex items-center justify-center mb-4">
                      <button
                        onClick={handlePlayPause}
                        className="w-20 h-20 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110"
                      >
                        {isPlaying ? (
                          <Pause className="w-8 h-8" />
                        ) : (
                          <Play className="w-8 h-8 ml-1" />
                        )}
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>{currentTime}</span>
                        <span>{totalTime}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full w-0" style={{width: '0%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="flex gap-3">
                    <button 
                      onClick={handleDownload}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载
                    </button>
                    <button 
                      onClick={handleShare}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      分享
                    </button>
                    <button 
                      onClick={handleFavorite}
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      收藏
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </GlassCard>
        )}
      </div>
      
      {/* Tab导航 */}
      <TabBar />
    </div>
  );
}

export default function RadioPodcastPage() {
  return (
    <ProtectedRoute>
      <RadioPodcastContent />
    </ProtectedRoute>
  );
}