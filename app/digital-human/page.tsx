'use client';

import { useState } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import { ProtectedRoute } from '@/components/auth';
import {
  User,
  Sparkles,
  Play,
  Pause,
  Download,
  Share,
  Heart,
  Settings,
  Mic,
  Volume2,
  Camera,
  Palette,
  Save,
  RotateCcw
} from 'lucide-react';

interface DigitalHuman {
  id: string;
  name: string;
  description: string;
  appearance: {
    avatar: string;
    hairstyle: string;
    clothing: string;
    accessories: string[];
  };
  voice: {
    style: string;
    speed: number;
    pitch: number;
    emotion: string;
  };
  behavior: {
    gestures: string[];
    expressions: string[];
    movement: string;
  };
  script: string;
  videoUrl: string;
  thumbnail: string;
  date: string;
  duration: string;
}

function DigitalHumanContent() {
  const [digitalHuman, setDigitalHuman] = useState<DigitalHuman | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 基础信息状态
  const [humanName, setHumanName] = useState('');
  const [description, setDescription] = useState('');
  const [script, setScript] = useState('');
  const [duration, setDuration] = useState('30');
  
  // 外观配置状态
  const [avatar, setAvatar] = useState('professional');
  const [hairstyle, setHairstyle] = useState('business');
  const [clothing, setClothing] = useState('suit');
  const [accessories, setAccessories] = useState<string[]>([]);
  
  // 语音配置状态
  const [voiceStyle, setVoiceStyle] = useState('professional');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [emotion, setEmotion] = useState('neutral');
  
  // 行为配置状态
  const [gestures, setGestures] = useState<string[]>(['natural']);
  const [expressions, setExpressions] = useState<string[]>(['neutral']);
  const [movement, setMovement] = useState('static');

  // 播放状态
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState('00:00');

  const avatarOptions = [
    { value: 'professional', label: '职业形象', desc: '正式、专业的商务形象' },
    { value: 'friendly', label: '亲和形象', desc: '友善、平易近人的气质' },
    { value: 'tech', label: '科技形象', desc: '未来感、科技感的造型' },
    { value: 'casual', label: '休闲形象', desc: '轻松、自然的日常风格' },
    { value: 'elegant', label: '优雅形象', desc: '精致、高雅的仪表' },
    { value: 'youthful', label: '青春形象', desc: '活力充沛的年轻形象' }
  ];

  const hairstyleOptions = [
    { value: 'business', label: '商务发型', desc: '端庄正式的商务造型' },
    { value: 'casual', label: '休闲发型', desc: '轻松自然的日常发型' },
    { value: 'creative', label: '创意发型', desc: '个性时尚的造型' },
    { value: 'minimal', label: '简约发型', desc: '简洁利落的发型' },
    { value: 'long', label: '长发造型', desc: '优雅的长发设计' },
    { value: 'short', label: '短发造型', desc: '干练的短发造型' }
  ];

  const clothingOptions = [
    { value: 'suit', label: '西装正装', desc: '专业的商务套装' },
    { value: 'casual', label: '休闲装', desc: '舒适的日常服装' },
    { value: 'tech', label: '科技风', desc: '未来感的科技服装' },
    { value: 'creative', label: '创意装', desc: '个性时尚的设计' },
    { value: 'traditional', label: '传统装', desc: '典雅的传统文化服饰' },
    { value: 'sports', label: '运动装', desc: '活力的运动风格' }
  ];

  const voiceStyleOptions = [
    { value: 'professional', label: '专业播音', desc: '正式权威的播音腔调' },
    { value: 'friendly', label: '亲和温暖', desc: '亲切友好的说话方式' },
    { value: 'energetic', label: '活力十足', desc: '充满活力的表达' },
    { value: 'calm', label: '平静稳重', desc: '沉稳冷静的语调' },
    { value: 'cheerful', label: '欢快活泼', desc: '快乐轻松的语调' },
    { value: 'wise', label: '智慧深邃', desc: '深沉睿智的表达' }
  ];

  const emotionOptions = [
    { value: 'neutral', label: '自然表情', desc: '平和自然的面部表情' },
    { value: 'happy', label: '开心喜悦', desc: '愉悦快乐的情绪表达' },
    { value: 'serious', label: '严肃认真', desc: '严谨专注的神态' },
    { value: 'warm', label: '温暖亲切', desc: '和善温暖的表情' },
    { value: 'confident', label: '自信坚定', desc: '自信果断的气质' },
    { value: 'creative', label: '创意活泼', desc: '充满创意的表达' }
  ];

  const gestureOptions = [
    { value: 'natural', label: '自然手势', desc: '自然流畅的手部动作' },
    { value: 'minimal', label: '简约手势', desc: '简洁优雅的动作' },
    { value: 'expressive', label: '丰富手势', desc: '生动丰富的表达' },
    { value: 'business', label: '商务手势', desc: '专业的商务动作' },
    { value: 'creative', label: '创意手势', desc: '富有创意的表达' }
  ];

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAccessoryToggle = (accessory: string) => {
    setAccessories(prev => 
      prev.includes(accessory) 
        ? prev.filter(a => a !== accessory)
        : [...prev, accessory]
    );
  };

  const handleGestureToggle = (gesture: string) => {
    setGestures(prev => 
      prev.includes(gesture) 
        ? prev.filter(g => g !== gesture)
        : [...prev, gesture]
    );
  };

  const handleExpressionToggle = (expression: string) => {
    setExpressions(prev => 
      prev.includes(expression) 
        ? prev.filter(e => e !== expression)
        : [...prev, expression]
    );
  };

  const handleGenerate = async () => {
    if (!humanName.trim() || !script.trim()) {
      setError('请填写数字人名称和演讲内容');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // 调用数字人API
      const response = await fetch('/api/digital-human', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: humanName,
          description,
          script,
          duration,
          appearance: {
            avatar,
            hairstyle,
            clothing,
            accessories
          },
          voice: {
            style: voiceStyle,
            speed: voiceSpeed,
            pitch: voicePitch,
            emotion
          },
          behavior: {
            gestures,
            expressions,
            movement
          }
        }),
      });

      const result = await response.json();

      if (result.success) {
        setDigitalHuman(result.data);
      } else {
        throw new Error(result.error || '生成失败');
      }

      setIsGenerating(false);

    } catch (error) {
      console.error('生成失败:', error);
      setError(error instanceof Error ? error.message : '生成数字人时出现错误，请重试');
      setIsGenerating(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      // 停止播放逻辑
      setIsPlaying(false);
    } else {
      // 开始播放逻辑
      setIsPlaying(true);
    }
  };

  const handleDownload = () => {
    if (!digitalHuman) return;
    
    const a = document.createElement('a');
    a.href = digitalHuman.videoUrl;
    a.download = `${digitalHuman.name}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = () => {
    if (navigator.share && digitalHuman) {
      navigator.share({
        title: digitalHuman.name,
        text: digitalHuman.description,
        url: window.location.href
      }).catch(console.error);
    } else if (digitalHuman) {
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

  const handleReset = () => {
    setHumanName('');
    setDescription('');
    setScript('');
    setDuration('30');
    setAvatar('professional');
    setHairstyle('business');
    setClothing('suit');
    setAccessories([]);
    setVoiceStyle('professional');
    setVoiceSpeed(1.0);
    setVoicePitch(1.0);
    setEmotion('neutral');
    setGestures(['natural']);
    setExpressions(['neutral']);
    setMovement('static');
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center">
            <User className="mr-4 text-teal-500 text-4xl" />
            数字人创建
          </h1>
          <p className="text-slate-600 text-lg">打造专属AI虚拟主播，实现个性化数字形象</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：配置面板 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基础信息 */}
            <GlassCard className="hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">基础信息</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      数字人名称 *
                    </label>
                    <input
                      type="text"
                      value={humanName}
                      onChange={(e) => setHumanName(e.target.value)}
                      className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                      placeholder="输入数字人名称..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      视频时长（秒）
                    </label>
                    <select
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                    >
                      <option value="15">15秒</option>
                      <option value="30">30秒</option>
                      <option value="60">1分钟</option>
                      <option value="120">2分钟</option>
                      <option value="300">5分钟</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    描述说明
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all"
                    placeholder="描述这个数字人的特点和用途..."
                  />
                </div>
                <div>
                  <label className="block text-lg font-semibold text-slate-800 mb-3">
                    演讲内容 *
                  </label>
                  <textarea
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-teal-500/30 transition-all text-base"
                    placeholder="输入数字人要演讲的内容，AI会根据内容生成相应的表情和动作..."
                  />
                </div>
              </div>
            </GlassCard>

            {/* 外观配置 */}
            <GlassCard className="hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">外观配置</h3>
              <div className="space-y-6">
                {/* 形象类型 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">形象类型</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {avatarOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setAvatar(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          avatar === option.value
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-slate-200 hover:border-teal-300 text-slate-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 发型 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">发型</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {hairstyleOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setHairstyle(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          hairstyle === option.value
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-slate-200 hover:border-teal-300 text-slate-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 服装 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">服装</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {clothingOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setClothing(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          clothing === option.value
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-slate-200 hover:border-teal-300 text-slate-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 配饰 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">配饰选择</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['眼镜', '手表', '项链', '耳机', '帽子', '徽章'].map((accessory) => (
                      <button
                        key={accessory}
                        onClick={() => handleAccessoryToggle(accessory)}
                        className={`p-3 rounded-lg border-2 transition-all text-center ${
                          accessories.includes(accessory)
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-slate-200 hover:border-teal-300 text-slate-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{accessory}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* 语音配置 */}
            <GlassCard className="hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">语音配置</h3>
              <div className="space-y-6">
                {/* 声音风格 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">声音风格</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {voiceStyleOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setVoiceStyle(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          voiceStyle === option.value
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-slate-200 hover:border-teal-300 text-slate-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 情感表达 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">情感表达</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {emotionOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setEmotion(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          emotion === option.value
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-slate-200 hover:border-teal-300 text-slate-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 语速和音调 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                      语速调节 ({voiceSpeed}x)
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={voiceSpeed}
                      onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>慢速</span>
                      <span>正常</span>
                      <span>快速</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-3">
                      音调调节 ({voicePitch}x)
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2.0"
                      step="0.1"
                      value={voicePitch}
                      onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>低沉</span>
                      <span>正常</span>
                      <span>高亢</span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* 行为配置 */}
            <GlassCard className="hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">行为配置</h3>
              <div className="space-y-6">
                {/* 手势选择 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">手势风格</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {gestureOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleGestureToggle(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          gestures.includes(option.value)
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-slate-200 hover:border-teal-300 text-slate-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 表情选择 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">主要表情</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {emotionOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleExpressionToggle(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          expressions.includes(option.value)
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-slate-200 hover:border-teal-300 text-slate-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 动作模式 */}
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-3">动作模式</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { value: 'static', label: '静态站立', desc: '保持站立姿势不变' },
                      { value: 'subtle', label: '细微动作', desc: '包含细微的自然动作' },
                      { value: 'dynamic', label: '丰富动作', desc: '包含丰富的肢体动作' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setMovement(option.value)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          movement === option.value
                            ? 'border-teal-500 bg-teal-50 text-teal-700'
                            : 'border-slate-200 hover:border-teal-300 text-slate-700'
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-slate-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !humanName.trim() || !script.trim()}
                className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                  isGenerating || !humanName.trim() || !script.trim()
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-teal-500 to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                }`}
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    生成中...
                  </>
                ) : (
                  <>
                    <User className="w-5 h-5 mr-2" />
                    生成数字人
                  </>
                )}
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-slate-500 hover:bg-slate-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                重置
              </button>
            </div>
          </div>

          {/* 右侧：预览和结果 */}
          <div>
            <GlassCard className="h-full hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">预览和结果</h3>
              
              {digitalHuman ? (
                <div className="space-y-6">
                  {/* 数字人预览 */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="aspect-video bg-slate-200 rounded-lg mb-4 flex items-center justify-center">
                      <img 
                        src={digitalHuman.thumbnail} 
                        alt={digitalHuman.name}
                        className="max-w-full max-h-full object-cover rounded-lg"
                      />
                    </div>
                    <h4 className="font-bold text-slate-800 mb-2">{digitalHuman.name}</h4>
                    <p className="text-sm text-slate-600 mb-3">{digitalHuman.description}</p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>时长: {digitalHuman.duration}</span>
                      <span>{digitalHuman.date}</span>
                    </div>
                  </div>

                  {/* 播放器 */}
                  <div className="bg-slate-50 rounded-xl p-4">
                    <div className="flex items-center justify-center mb-4">
                      <button
                        onClick={handlePlayPause}
                        className="w-16 h-16 bg-teal-500 hover:bg-teal-600 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-110"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6" />
                        ) : (
                          <Play className="w-6 h-6 ml-1" />
                        )}
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>{currentTime}</span>
                        <span>{digitalHuman.duration}</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-teal-500 h-2 rounded-full w-0" style={{width: '0%'}}></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* 操作按钮 */}
                  <div className="space-y-3">
                    <button 
                      onClick={handleDownload}
                      className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      下载视频
                    </button>
                    <button 
                      onClick={handleShare}
                      className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Share className="w-4 h-4 mr-2" />
                      分享
                    </button>
                    <button 
                      onClick={handleFavorite}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      收藏
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                  <p className="text-slate-600 mb-2">配置完成后</p>
                  <p className="text-sm text-slate-500">生成专属数字人形象</p>
                </div>
              )}
            </GlassCard>
          </div>
        </div>

        {/* 核心功能 */}
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 虚拟形象 */}
            <div className="group">
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-teal-800 mb-3">虚拟形象</h4>
                <p className="text-teal-700 text-sm mb-4 leading-relaxed">高度定制的数字人形象，支持多样化的外观和风格设计</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-teal-600">
                    <Palette className="w-3 h-3 mr-2" />
                    <span>外观定制</span>
                  </div>
                  <div className="flex items-center text-xs text-teal-600">
                    <Palette className="w-3 h-3 mr-2" />
                    <span>风格多样</span>
                  </div>
                  <div className="flex items-center text-xs text-teal-600">
                    <Palette className="w-3 h-3 mr-2" />
                    <span>形象逼真</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 语音合成 */}
            <div className="group">
              <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-cyan-800 mb-3">语音合成</h4>
                <p className="text-cyan-700 text-sm mb-4 leading-relaxed">自然流畅的语音合成，支持多种声音风格和情感表达</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-cyan-600">
                    <Volume2 className="w-3 h-3 mr-2" />
                    <span>多声线选择</span>
                  </div>
                  <div className="flex items-center text-xs text-cyan-600">
                    <Volume2 className="w-3 h-3 mr-2" />
                    <span>情感表达</span>
                  </div>
                  <div className="flex items-center text-xs text-cyan-600">
                    <Volume2 className="w-3 h-3 mr-2" />
                    <span>语调节奏</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 动作表情 */}
            <div className="group">
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-green-800 mb-3">动作表情</h4>
                <p className="text-green-700 text-sm mb-4 leading-relaxed">丰富的肢体动作和面部表情，让数字人更加生动自然</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-green-600">
                    <Sparkles className="w-3 h-3 mr-2" />
                    <span>自然手势</span>
                  </div>
                  <div className="flex items-center text-xs text-green-600">
                    <Sparkles className="w-3 h-3 mr-2" />
                    <span>表情动作</span>
                  </div>
                  <div className="flex items-center text-xs text-green-600">
                    <Sparkles className="w-3 h-3 mr-2" />
                    <span>动作同步</span>
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

export default function DigitalHumanPage() {
  return (
    <ProtectedRoute>
      <DigitalHumanContent />
    </ProtectedRoute>
  );
}