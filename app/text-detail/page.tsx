'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useWorkData } from '@/hooks/useWorkData';
import { useAuthorWorks } from '@/hooks/useAuthorWorks';
import { LoadingState, ActionButtons } from '@/components/common';
import { DetailPageLayout } from '@/components/detail';
import { ProtectedRoute } from '@/components/auth';

function TextDetailContent() {
  const [showFullText, setShowFullText] = useState(false);
  const searchParams = useSearchParams();
  const workId = searchParams.get('id');

  const { data, loading, error, refetch } = useWorkData(workId);
  
  // 获取当前作者的作品
  const { works: authorWorks, loading: worksLoading } = useAuthorWorks(data?.creator?.id || null);

  // 获取相关作品（排除当前作品）
  const getRelatedArtworks = () => {
    if (!data || !authorWorks) return [];
    return authorWorks
      .filter(work => work.id !== data.id)
      .slice(0, 4);
  };

  // 获取文字内容
  const getTextContent = () => {
    if (!data) return '';
    
    console.log('=== 文本内容获取调试 ===');
    console.log('Data object:', data);
    console.log('ContentData:', data.contentData);
    console.log('Description:', data.description);
    console.log('Prompt:', data.prompt);
    
    // 优先从contentData.content中获取真正的文本内容
    if (data.contentData && typeof data.contentData === 'object') {
      const contentData = data.contentData as Record<string, unknown>;
      console.log('ContentData object:', contentData);
      
      // 尝试多个可能的键
      const possibleKeys = ['content', 'text', 'generatedContent', 'result'];
      for (const key of possibleKeys) {
        const textContent = contentData[key] as string;
        console.log(`Trying key '${key}':`, textContent);
        
        if (textContent && textContent.trim() && textContent.trim() !== data.prompt) {
          console.log(`✅ Found content in '${key}':`, textContent);
          return textContent;
        }
      }
    }
    
    // 如果contentData中没有内容，再从description获取
    if (data.description && data.description.trim()) {
      console.log('✅ Using description:', data.description);
      return data.description;
    }
    
    // 如果都没有内容，返回提示信息
    console.log('❌ No content found, showing fallback message');
    return '此作品的文本内容暂时无法显示，请稍后再试。';
  };

  // 获取内容类型对应的图标和颜色
  const getContentTypeInfo = (contentType: string) => {
    switch (contentType) {
      case 'text':
        return { icon: 'fas fa-file-alt', color: 'from-purple-500 to-pink-600', bgColor: 'bg-purple-50' };
      case 'audio':
        return { icon: 'fas fa-music', color: 'from-green-500 to-teal-600', bgColor: 'bg-green-50' };
      case 'video':
        return { icon: 'fas fa-video', color: 'from-red-500 to-pink-600', bgColor: 'bg-red-50' };
      default:
        return { icon: 'fas fa-file', color: 'from-blue-500 to-indigo-600', bgColor: 'bg-blue-50' };
    }
  };

  const contentTypeInfo = data ? getContentTypeInfo(data.contentType) : getContentTypeInfo('text');
  const textContent = getTextContent();
  
  // 添加调试信息
  console.log('TextDetail - Data:', data);
  console.log('TextDetail - ContentData:', data?.contentData);
  console.log('TextDetail - TextContent:', textContent);
  console.log('TextDetail - TextContent Length:', textContent.length);
  
  // 改进文本处理逻辑
  const processedText = textContent.trim();
  const isLongText = processedText.length > 800;
  const displayText = showFullText || !isLongText ? processedText : processedText.slice(0, 800);
  
  // 更准确的中文字符统计
  const wordCount = processedText.length;
  const readTime = Math.max(1, Math.ceil(wordCount / 400)); // 中文阅读速度约为每分钟400字

  // Markdown 渲染函数
  const renderMarkdownContent = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // 标题
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={currentIndex++} className="text-2xl font-bold text-slate-800 mb-4 mt-6">
            {line.substring(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={currentIndex++} className="text-xl font-bold text-slate-800 mb-3 mt-5">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={currentIndex++} className="text-lg font-semibold text-slate-800 mb-3 mt-4">
            {line.substring(4)}
          </h3>
        );
      }
      // 列表
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        const listItems = [line.substring(2)];
        
        // 收集连续的列表项
        for (let j = i + 1; j < lines.length && (lines[j].trim().startsWith('- ') || lines[j].trim().startsWith('* ')); j++) {
          listItems.push(lines[j].trim().substring(2));
          i = j;
        }

        elements.push(
          <ul key={currentIndex++} className="list-disc list-inside space-y-2 mb-4 ml-4">
            {listItems.map((item, index) => (
              <li key={index} className="text-slate-700">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ul>
        );
      }
      // 数字列表
      else if (/^\d+\. /.test(line)) {
        const listItems = [line.substring(line.indexOf(' ') + 1)];
        
        // 收集连续的列表项
        for (let j = i + 1; j < lines.length && /^\d+\. /.test(lines[j].trim()); j++) {
          listItems.push(lines[j].trim().substring(lines[j].trim().indexOf(' ') + 1));
          i = j;
        }

        elements.push(
          <ol key={currentIndex++} className="list-decimal list-inside space-y-2 mb-4 ml-4">
            {listItems.map((item, index) => (
              <li key={index} className="text-slate-700">
                {renderInlineMarkdown(item)}
              </li>
            ))}
          </ol>
        );
      }
      // 普通段落
      else {
        elements.push(
          <p key={currentIndex++} className="text-slate-700 leading-relaxed mb-4">
            {renderInlineMarkdown(line)}
          </p>
        );
      }
    }

    return <div>{elements}</div>;
  };

  // 行内 markdown 渲染（粗体、斜体等）
  const renderInlineMarkdown = (text: string) => {
    // 粗体 **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let parts = text.split(boldRegex);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // 奇数索引是粗体内容
        return (
          <strong key={index} className="font-bold text-slate-800">
            {part}
          </strong>
        );
      } else {
        // 偶数索引是普通文本，可能包含斜体
        const italicRegex = /\*(.*?)\*/g;
        const italicParts = part.split(italicRegex);
        
        return italicParts.map((italicPart, italicIndex) => {
          if (italicIndex % 2 === 1) {
            // 奇数索引是斜体内容
            return (
              <em key={italicIndex} className="italic">
                {italicPart}
              </em>
            );
          } else {
            return italicPart;
          }
        });
      }
    });
  };

  return (
    <DetailPageLayout
      loading={loading}
      error={error}
      data={data}
      themeColor="purple"
      onRetry={refetch}
      relatedWorks={
        data && (
          <>
            {worksLoading ? (
              <div className="flex justify-center py-8">
                <LoadingState message="加载作者作品..." />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {getRelatedArtworks().length > 0 ? (
                  getRelatedArtworks().map((artwork) => (
                    <Link key={artwork.id} href={`/text-detail?id=${artwork.id}`}>
                      <div className="group cursor-pointer">
                        <div className="bg-white rounded-xl p-4 hover:shadow-md transition-shadow">
                          <h4 className="font-semibold text-slate-800 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">
                            {artwork.title}
                          </h4>
                          <p className="text-slate-600 text-sm line-clamp-3">
                            {artwork.contentType === 'text' ? '文字创作作品' : 
                             artwork.contentType === 'image' ? '图像创作作品' :
                             artwork.contentType === 'audio' ? '音频创作作品' :
                             '视频创作作品'}
                          </p>
                          <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-3 border-t border-slate-200">
                            <span>{new Date(artwork.createdAt).toLocaleDateString('zh-CN')}</span>
                            <span className="group-hover:translate-x-1 transition-transform">查看详情 →</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <div className="text-slate-500">
                      <i className="fas fa-file-alt text-4xl mb-2 opacity-50"></i>
                      <p>作者暂无其他作品</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )
      }
    >
      {/* 主文本展示 */}
      {data && (
        <div className="space-y-6">
          {/* 标题和基本信息 */}
          <div className="bg-white rounded-xl p-6">
            {/* 提取真正的提示词内容 */}
            {(() => {
              const description = data.description || data.title;
              // 如果description包含多个部分，提取最后一部分作为真正的提示词
              const promptText = description.includes('提示词：') 
                ? description.split('提示词：')[1]?.split('|')[0]?.trim() 
                : description.split('|').pop()?.trim() || description;
              
              return <h1 className="text-2xl font-bold text-slate-800 mb-4">  {promptText}</h1>;
            })()}
            
            <div className="space-y-2 ml-4">
              <div className="text-sm text-slate-500">
                {new Date(data.createdAt).toLocaleDateString('zh-CN')} {new Date(data.createdAt).toLocaleTimeString('zh-CN', {hour: '2-digit', minute: '2-digit'})}
              </div>
            </div>
          </div>

          {/* 文本内容 */}
          <div className="bg-white rounded-xl p-6">
            {!processedText || processedText === '此作品的文本内容暂时无法显示，请稍后再试。' ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-file-alt text-2xl text-slate-400"></i>
                </div>
                <h3 className="text-lg font-semibold text-slate-600 mb-3">内容暂时无法显示</h3>
                <p className="text-slate-500 mb-6">该作品的文本内容可能尚未加载完成或格式不正确。</p>
                <button
                  onClick={refetch}
                  className="inline-flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                >
                  <i className="fas fa-redo mr-2"></i>
                  重新加载
                </button>
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                {renderMarkdownContent(displayText)}
                
                {/* 展开/收起按钮 */}
                {isLongText && (
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setShowFullText(!showFullText)}
                      className="inline-flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                    >
                      <i className={`fas ${showFullText ? 'fa-compress-alt' : 'fa-expand-alt'} mr-2`} />
                      {showFullText ? '收起内容' : `展开全文 (${processedText.length - 800} 字符)`}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* 互动操作栏 */}
          <div className="bg-white rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span>浏览 {data.viewsCount || 0}</span>
                <span>点赞 {data.likesCount || 0}</span>
              </div>
              
              <ActionButtons
                initialLiked={false}
                onLike={(liked) => console.log('Like:', liked)}
                onFavorite={(fav) => console.log('Favorite:', fav)}
                onShare={() => navigator.clipboard?.writeText(window.location.href)}
                onReport={() => alert('举报作品...')}
                size="md"
              />
            </div>
          </div>
        </div>
      )}
    </DetailPageLayout>
  );
}

export default function TextDetailPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
            <LoadingState message="加载中..." />
          </div>
        }
      >
        <TextDetailContent />
      </Suspense>
    </ProtectedRoute>
  );
}
