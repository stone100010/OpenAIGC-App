'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import { useAuth } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth';
import ReactMarkdown from 'react-markdown';

// 编程语言选项
const languageOptions = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'sql', name: 'SQL' },
  { id: 'react', name: 'React' },
  { id: 'vue', name: 'Vue' }
];

// 代码类型模板
const typeOptions = [
  { id: 'function', name: '函数/方法', prompt: '请编写一个函数实现以下功能：' },
  { id: 'class', name: '类/组件', prompt: '请编写一个类或组件实现以下功能：' },
  { id: 'algorithm', name: '算法实现', prompt: '请实现以下算法：' },
  { id: 'api', name: 'API接口', prompt: '请编写一个API接口实现以下功能：' },
  { id: 'utility', name: '工具函数', prompt: '请编写一组工具函数实现以下功能：' },
  { id: 'debug', name: '代码调试', prompt: '请帮我调试和修复以下代码的问题：' },
  { id: 'optimize', name: '代码优化', prompt: '请优化以下代码的性能和可读性：' }
];

// 灵感提示
const inspirationList = [
  { id: 1, title: '防抖函数', prompt: '实现一个防抖函数，支持立即执行选项和取消功能' },
  { id: 2, title: '深拷贝', prompt: '编写一个深拷贝函数，能够处理循环引用的情况' },
  { id: 3, title: 'LRU缓存', prompt: '实现一个LRU缓存数据结构，支持get和put操作' },
  { id: 4, title: '并发控制', prompt: '编写一个并发请求控制函数，限制最大并发数为3' }
];

const randomPrompts = [
  '实现一个防抖函数，支持立即执行选项',
  '编写一个深拷贝函数，处理循环引用',
  '实现一个LRU缓存数据结构',
  '编写一个表单验证工具类',
  '实现一个简单的事件发布订阅系统',
  '编写一个并发请求控制函数'
];

function CodeGenContent() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [selectedType, setSelectedType] = useState('function');
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

  // 生成代码
  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    if (!isAuthenticated) {
      alert('请先登录后再使用代码生成功能');
      router.push('/auth/login');
      return;
    }

    setIsGenerating(true);
    setGeneratedContent('');
    setError(null);

    try {
      const typeConfig = typeOptions.find(t => t.id === selectedType);
      const langConfig = languageOptions.find(l => l.id === selectedLanguage);
      const fullPrompt = `${typeConfig?.prompt || ''}\n\n${prompt}`;

      const response = await fetch('/api/text-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: fullPrompt,
          type: 'code',
          language: langConfig?.name || 'JavaScript',
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

      if (resultRef.current) {
        resultRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    } catch (error) {
      console.error('代码生成失败:', error);
      setError(error instanceof Error ? error.message : '生成过程中出现未知错误');
    } finally {
      setIsGenerating(false);
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
    const extensions: Record<string, string> = {
      javascript: 'js', typescript: 'ts', python: 'py', java: 'java',
      go: 'go', rust: 'rs', sql: 'sql', react: 'tsx', vue: 'vue'
    };
    const ext = extensions[selectedLanguage] || 'txt';
    const blob = new Blob([generatedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `code-${Date.now()}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
              ? 'from-slate-200 to-gray-200 border-slate-400 ring-2 ring-slate-400/50'
              : 'from-slate-100 to-gray-100 border-slate-200 hover:from-slate-200 hover:to-gray-200'
          }`}
        >
          <span>{selectedOption?.name}</span>
          <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-slate-400 text-sm`}></i>
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
                    option.id === value ? 'bg-slate-100 text-slate-800 font-medium' : 'text-slate-700'
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
            <i className="fas fa-code mr-4 text-slate-700 text-4xl"></i>
            AI代码生成
          </h1>
          <p className="text-slate-600 text-lg">智能编程助手，快速生成高质量代码</p>
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
                    className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-slate-500/30 transition-all text-base font-mono"
                    placeholder="请详细描述您需要实现的功能，包括输入输出、边界条件、性能要求等..."
                  />
                </div>

                {/* 参数选择 */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <CustomDropdown
                      value={selectedLanguage}
                      onChange={setSelectedLanguage}
                      options={languageOptions}
                      dropdownKey="language"
                    />
                  </div>
                  <div className="flex-1">
                    <CustomDropdown
                      value={selectedType}
                      onChange={setSelectedType}
                      options={typeOptions}
                      dropdownKey="type"
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
                        : 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        生成中...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-terminal mr-2"></i>
                        生成代码
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
                        <div className="w-16 h-16 border-4 border-slate-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-600 mb-2">正在生成中...</p>
                        <p className="text-xs text-slate-400">AI正在编写您的代码</p>
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
                        {/* Markdown 渲染区域 - 代码风格 */}
                        <div className="bg-white rounded-xl p-6 min-h-[200px] overflow-x-auto border border-slate-200">
                          <div className="prose prose-slate max-w-none
                            prose-headings:text-slate-800 prose-headings:font-bold prose-headings:border-b prose-headings:border-slate-200 prose-headings:pb-2 prose-headings:mb-4
                            prose-h2:text-lg prose-h2:mt-6 prose-h2:first:mt-0
                            prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-pre:rounded-lg prose-pre:shadow-lg
                            prose-code:text-pink-600 prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
                            prose-hr:border-slate-300 prose-hr:my-6
                            prose-p:text-slate-600 prose-p:leading-relaxed
                            prose-li:text-slate-600">
                            <ReactMarkdown>{generatedContent}</ReactMarkdown>
                            {isGenerating && <span className="inline-block w-2 h-5 bg-slate-700 animate-pulse ml-1" />}
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex gap-3">
                          <button
                            onClick={handleCopy}
                            className="flex-1 bg-slate-700 hover:bg-slate-800 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            <i className="fas fa-copy mr-2"></i>
                            复制
                          </button>
                          <button
                            onClick={handleDownload}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                          >
                            <i className="fas fa-download mr-2"></i>
                            下载
                          </button>
                          <button
                            onClick={handleGenerate}
                            className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
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
                    className="group cursor-pointer p-4 bg-gradient-to-r from-slate-50 to-gray-100 rounded-xl hover:from-slate-100 hover:to-gray-200 transition-all duration-300"
                    onClick={() => setPrompt(item.prompt)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-slate-800">{item.title}</h4>
                      <i className="fas fa-plus text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity"></i>
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
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-slate-800 mb-3">智能编码</h4>
                <p className="text-slate-600 text-sm mb-4 leading-relaxed">基于大语言模型，精准理解编程需求，生成高质量代码</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-slate-600">
                    <i className="fas fa-check-circle mr-2 text-emerald-500"></i>
                    <span>支持多种编程语言</span>
                  </div>
                  <div className="flex items-center text-xs text-slate-600">
                    <i className="fas fa-check-circle mr-2 text-emerald-500"></i>
                    <span>代码注释清晰</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-emerald-800 mb-3">多语言支持</h4>
                <p className="text-emerald-700 text-sm mb-4 leading-relaxed">支持 JavaScript、Python、Java 等主流编程语言</p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">JavaScript</span>
                  <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">Python</span>
                  <span className="bg-emerald-200 text-emerald-800 px-2 py-1 rounded-full text-xs font-medium">TypeScript</span>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-gray-800 mb-3">便捷导出</h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">一键复制或下载生成的代码，按语言自动识别扩展名</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <i className="fas fa-check-circle mr-2 text-emerald-500"></i>
                    <span>一键复制代码</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <i className="fas fa-check-circle mr-2 text-emerald-500"></i>
                    <span>智能文件命名</span>
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

export default function CodeGenPage() {
  return (
    <ProtectedRoute>
      <CodeGenContent />
    </ProtectedRoute>
  );
}
