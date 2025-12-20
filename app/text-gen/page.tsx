'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth';
import ReactMarkdown from 'react-markdown';

// 文案风格选项
const styleOptions = [
  { id: 'professional', name: '专业商务' },
  { id: 'creative', name: '创意活泼' },
  { id: 'emotional', name: '情感共鸣' },
  { id: 'marketing', name: '营销推广' },
  { id: 'storytelling', name: '故事叙述' },
  { id: 'concise', name: '简洁明了' }
];

// 文案类型模板
const typeOptions = [
  { id: 'ad', name: '广告文案', prompt: '请为以下产品/服务撰写一段吸引人的广告文案：' },
  { id: 'social', name: '社交媒体', prompt: '请为以下内容撰写适合社交媒体发布的文案：' },
  { id: 'article', name: '文章段落', prompt: '请围绕以下主题撰写一段精彩的文章内容：' },
  { id: 'slogan', name: '标语口号', prompt: '请为以下品牌/活动创作几个朗朗上口的标语：' },
  { id: 'email', name: '邮件内容', prompt: '请撰写一封专业的商务邮件，主题是：' },
  { id: 'description', name: '产品描述', prompt: '请为以下产品撰写详细的描述文案：' }
];

// 灵感提示
const inspirationList = [
  { id: 1, title: '产品发布', prompt: '一款智能健康手环的产品发布文案，强调健康监测和时尚设计' },
  { id: 2, title: '活动宣传', prompt: '咖啡店五周年庆活动，全场饮品买一送一' },
  { id: 3, title: '品牌故事', prompt: '一个专注可持续发展的环保服装品牌的品牌故事' },
  { id: 4, title: '节日营销', prompt: '双十一电商大促，数码产品限时折扣活动' }
];

const randomPrompts = [
  '一款智能健康手环的产品发布文案',
  '咖啡店周年庆活动宣传语',
  '环保主题公益广告文案',
  '科技公司企业文化介绍',
  '新书发布会邀请函内容',
  '线上课程的招生宣传文案'
];

function TextGenContent() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('professional');
  const [selectedType, setSelectedType] = useState('ad');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // 随机灵感
  const handleRandomPrompt = () => {
    const randomPrompt = randomPrompts[Math.floor(Math.random() * randomPrompts.length)];
    setPrompt(randomPrompt);
  };

  // 生成文案
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!isAuthenticated) {
      alert('请先登录后再使用文案生成功能');
      router.push('/auth/login');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');
    setError(null);

    try {
      const typeConfig = typeOptions.find(t => t.id === selectedType);
      const styleConfig = styleOptions.find(s => s.id === selectedStyle);
      const fullPrompt = `${typeConfig?.prompt || ''}\n\n${prompt}`;

      const response = await fetch('/api/text-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          type: 'copywriting',
          copywritingStyle: styleConfig?.name || '专业商务',
          stream: true
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '生成失败');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      if (!reader) throw new Error('无法读取响应流');

      let content = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            try {
              const json = JSON.parse(data);
              if (json.content) {
                content += json.content;
                setGeneratedContent(content);
              }
            } catch {}
          }
        }
      }

      // 生成完成后保存到数据库
      if (content.trim()) {
        try {
          await saveToDatabase(content, styleConfig?.name || '专业商务');
          console.log('文案内容已保存到数据库');
        } catch (saveError) {
          console.error('保存到数据库失败:', saveError);
          // 不影响主流程，只记录错误
        }
      }

      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('文案生成失败:', error);
      setError(error instanceof Error ? error.message : '生成过程中出现未知错误');
    } finally {
      setIsGenerating(false);
    }
  };

  // 保存到数据库
  const saveToDatabase = async (content: string, style: string) => {
    try {
      const typeConfig = typeOptions.find(t => t.id === selectedType);
      const title = `${typeConfig?.name || '文案'}-${new Date().toLocaleString('zh-CN')}`;
      const description = `风格：${style} | 类型：${typeConfig?.name || '文案'} | 提示词：${prompt}`;

      const saveResponse = await fetch('/api/creative-works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          content_type: 'text',
          content_data: {
            content,
            style,
            type: selectedType,
            originalPrompt: prompt
          },
          tags: [style, typeConfig?.name || '文案', 'AI生成']
        })
      });

      if (!saveResponse.ok) {
        const errorData = await saveResponse.json();
        throw new Error(errorData.message || '保存失败');
      }

      const saveResult = await saveResponse.json();
      return saveResult;
    } catch (error) {
      console.error('保存文案到数据库失败:', error);
      throw error;
    }
  };

  // 复制内容
  const handleCopy = async () => {
    if (!generatedContent) return;
    try {
      await navigator.clipboard.writeText(generatedContent);
      alert('已复制到剪贴板');
    } catch {
      alert('复制失败，请手动复制');
    }
  };

  // 下载内容
  const handleDownload = () => {
    if (!generatedContent) return;
    const blob = new Blob([generatedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `文案-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 手动保存到创作天地
  const handleSaveToWorks = async () => {
    if (!generatedContent.trim()) {
      alert('请先生成文案内容');
      return;
    }

    try {
      const typeConfig = typeOptions.find(t => t.id === selectedType);
      const styleConfig = styleOptions.find(s => s.id === selectedStyle);
      const title = `${typeConfig?.name || '文案'}-${new Date().toLocaleString('zh-CN')}`;
      const description = `风格：${styleConfig?.name || '专业商务'} | 类型：${typeConfig?.name || '文案'} | 提示词：${prompt}`;

      const response = await fetch('/api/creative-works', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          content_type: 'text',
          content_data: {
            content: generatedContent,
            style: styleConfig?.name || '专业商务',
            type: selectedType,
            originalPrompt: prompt
          },
          tags: [styleConfig?.name || '专业商务', typeConfig?.name || '文案', 'AI生成']
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '保存失败');
      }

      const result = await response.json();
      alert('文案已成功保存到创作天地！');
      console.log('保存结果:', result);
    } catch (error) {
      console.error('保存文案失败:', error);
      alert(`保存失败: ${error instanceof Error ? error.message : '未知错误'}`);
    }
  };

  // 自定义下拉组件
  const CustomDropdown = ({
    value,
    onChange,
    options,
    dropdownKey
  }: {
    value: string;
    onChange: (value: string) => void;
    options: { id: string; name: string }[];
    dropdownKey: string;
  }) => {
    const isOpen = openDropdown === dropdownKey;
    const selectedOption = options.find(opt => opt.id === value);

    useEffect(() => {
      const handleClickOutside = () => setOpenDropdown(null);
      if (isOpen) {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
      }
    }, [isOpen]);

    return (
      <div className="relative" style={{ zIndex: 10000 }}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setOpenDropdown(isOpen ? null : dropdownKey);
          }}
          className={`w-full p-3 bg-gradient-to-r rounded-xl border transition-all text-sm font-medium text-slate-700 shadow-sm hover:shadow-md flex items-center justify-between ${
            isOpen
              ? 'from-indigo-100 to-purple-100 border-indigo-400 ring-2 ring-indigo-400/50'
              : 'from-indigo-50 to-purple-50 border-indigo-200 hover:from-indigo-100 hover:to-purple-100'
          }`}
        >
          <span>{selectedOption?.name}</span>
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-indigo-400 text-sm`}></i>
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-200" style={{ zIndex: 10001 }}>
            <div className="max-h-48 overflow-y-auto">
              {options.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(option.id);
                    setOpenDropdown(null);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-slate-50 ${
                    option.id === value ? 'bg-indigo-50 text-indigo-600 font-medium' : 'text-slate-700'
                  }`}
                >
                  {option.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center">
            <i className="fas fa-pen-fancy mr-4 text-indigo-500 text-4xl"></i>
            AI文案生成
          </h1>
          <p className="text-slate-600 text-lg">智能文案创作助手，激发无限创意灵感</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：输入区域 */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-6">
                {/* 文本输入区域 */}
                <div>
                  <label className="block text-lg font-semibold text-slate-800 mb-3">
                    描述您的需求
                  </label>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all text-base"
                    placeholder="请详细描述您需要的文案内容，包括产品特点、目标受众、期望效果等..."
                  />
                </div>

                {/* 参数选择 */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <CustomDropdown
                      value={selectedType}
                      onChange={setSelectedType}
                      options={typeOptions}
                      dropdownKey="type"
                    />
                  </div>
                  <div className="flex-1">
                    <CustomDropdown
                      value={selectedStyle}
                      onChange={setSelectedStyle}
                      options={styleOptions}
                      dropdownKey="style"
                    />
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
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
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
                        生成文案
                      </>
                    )}
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* 生成结果展示 */}
            {(generatedContent || isGenerating || error) && (
              <div ref={resultRef}>
                <GlassCard className="hover:shadow-xl transition-shadow duration-300">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">生成结果</h3>

                    {isGenerating && !generatedContent ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-600 mb-2">正在生成中...</p>
                        <p className="text-xs text-slate-400">AI正在创作您的专属文案</p>
                      </div>
                    ) : error ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                          <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
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
                    ) : generatedContent ? (
                      <div className="space-y-4">
                        {/* Markdown 渲染区域 */}
                        <div className="bg-slate-50 rounded-xl p-6 min-h-[200px]">
                          <div className="prose prose-slate max-w-none prose-p:my-2 prose-headings:mt-4 prose-headings:mb-2 prose-li:my-1">
                            <ReactMarkdown>{generatedContent}</ReactMarkdown>
                            {isGenerating && <span className="inline-block w-2 h-5 bg-indigo-500 animate-pulse ml-1" />}
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex gap-3">
                          <button
                            onClick={handleCopy}
                            className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            <i className="fas fa-copy mr-2"></i>
                            复制
                          </button>
                          <button
                            onClick={handleDownload}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            <i className="fas fa-download mr-2"></i>
                            下载
                          </button>
                          <button
                            onClick={handleSaveToWorks}
                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            <i className="fas fa-save mr-2"></i>
                            保存到创作天地
                          </button>
                          <button
                            onClick={handleGenerate}
                            className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            <i className="fas fa-redo mr-2"></i>
                            重新生成
                          </button>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </GlassCard>
              </div>
            )}
          </div>

          {/* 右侧：灵感卡片 */}
          <div>
            <GlassCard className="h-full hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">灵感卡片</h3>
              <div className="space-y-4">
                {inspirationList.map((item) => (
                  <div
                    key={item.id}
                    className="group cursor-pointer p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl hover:from-indigo-100 hover:to-purple-100 transition-all duration-300"
                    onClick={() => setPrompt(item.prompt)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-800">{item.title}</h4>
                      <i className="fas fa-plus text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{item.prompt}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* 核心功能 */}
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="group">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-indigo-800 mb-3">智能创作</h4>
                <p className="text-indigo-700 text-sm mb-4 leading-relaxed">基于大语言模型，精准理解您的需求，生成高质量文案内容</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-indigo-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>支持多种文案类型</span>
                  </div>
                  <div className="flex items-center text-xs text-indigo-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>实时流式输出</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-emerald-800 mb-3">多种风格</h4>
                <p className="text-emerald-700 text-sm mb-4 leading-relaxed">涵盖专业商务、创意活泼、情感共鸣等多种风格</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">专业商务</span>
                  <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">创意活泼</span>
                  <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">营销推广</span>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-purple-800 mb-3">便捷导出</h4>
                <p className="text-purple-700 text-sm mb-4 leading-relaxed">一键复制或下载生成的文案，方便您的使用</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-purple-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>一键复制到剪贴板</span>
                  </div>
                  <div className="flex items-center text-xs text-purple-600">
                    <i className="fas fa-check-circle mr-2"></i>
                    <span>支持文件下载</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TabBar />
    </div>
  );
}

export default function TextGenPage() {
  return (
    <ProtectedRoute>
      <TextGenContent />
    </ProtectedRoute>
  );
}
