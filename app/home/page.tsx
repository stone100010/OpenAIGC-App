'use client';

import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import Image from 'next/image';
import Link from 'next/link';

const artworks = [
  // 图片类 - 大卡片
  {
    id: 1,
    type: 'image',
    title: '梦幻森林',
    description: 'AI生成的奇幻森林景观，充满神秘色彩',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80',
    size: 'md:col-span-2 h-[320px]'
  },
  {
    id: 2,
    type: 'video',
    title: '未来城市',
    description: '科幻风格的城市未来景象',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    size: 'h-[240px]'
  },
  {
    id: 3,
    type: 'text',
    title: '诗歌创作',
    description: '关于星空的现代诗',
    content: '在无垠的宇宙深处，星辰如钻石般闪烁，引领着人类探索未知的勇气与梦想...',
    image: 'https://images.unsplash.com/photo-1493238792000-8113da705763?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    size: 'h-[180px]'
  },
  {
    id: 4,
    type: 'audio',
    title: '自然之声',
    description: '森林鸟鸣与溪流声的自然音乐',
    duration: '05:32',
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    size: 'h-[200px]'
  },
  {
    id: 5,
    type: 'image',
    title: '抽象艺术',
    description: '色彩斑斓的抽象画作',
    image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300&q=80',
    size: 'h-[250px]'
  },
  {
    id: 6,
    type: 'video',
    title: '海浪视频',
    description: '壮观的海洋波浪动画',
    image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    size: 'md:col-span-2 h-[280px]'
  },
  {
    id: 7,
    type: 'text',
    title: '创意故事',
    description: 'AI辅助创作的小说片段',
    content: '当第一缕晨光穿过云层洒向大地，整个世界仿佛被镀上一层金辉。在这个宁静的早晨，一切都显得那么美好而充满希望...',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    size: 'h-[160px]'
  },
  {
    id: 8,
    type: 'audio',
    title: '电子音乐',
    description: 'AI生成的电子音乐作品',
    duration: '03:45',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
    size: 'h-[190px]'
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen pb-24">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2">创作天地</h1>
          <p className="text-slate-600 text-lg">发现无限创意可能</p>
        </div>

        {/* 作品瀑布流网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {artworks.map((artwork) => (
            <Link 
              key={artwork.id} 
              href={`/${
                artwork.type === 'image' ? 'image-detail' :
                artwork.type === 'video' ? 'video-detail' :
                artwork.type === 'text' ? 'text-detail' :
                artwork.type === 'audio' ? 'audio-detail' :
                'artwork-detail'
              }`}
            >
              <div className={`group glass rounded-2xl overflow-hidden relative cursor-pointer transform hover:scale-105 transition-all duration-300 hover:shadow-xl ${artwork.size}`}>
                
                {/* 图片类型卡片 */}
                {artwork.type === 'image' && (
                  <div className="relative w-full h-full">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <div className="w-8 h-8 bg-blue-500/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <i className="fas fa-image text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-semibold mb-1">{artwork.title}</h3>
                      <p className="text-sm opacity-90">{artwork.description}</p>
                    </div>
                  </div>
                )}

                {/* 视频类型卡片 */}
                {artwork.type === 'video' && (
                  <div className="relative w-full h-full">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    {/* 播放按钮 */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <i className="fas fa-play text-white text-xl ml-1"></i>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4">
                      <div className="w-8 h-8 bg-red-500/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <i className="fas fa-video text-white text-sm"></i>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                      <h3 className="text-lg font-semibold mb-1">{artwork.title}</h3>
                      <p className="text-sm opacity-90">{artwork.description}</p>
                    </div>
                  </div>
                )}

                {/* 文字类型卡片 */}
                {artwork.type === 'text' && (
                  <div className="relative w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-purple-50 to-pink-50">
                    <div className="absolute top-4 left-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-file-alt text-white text-sm"></i>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">{artwork.title}</h3>
                      <p className="text-sm text-slate-600 mb-4">{artwork.description}</p>
                      <p className="text-sm text-slate-700 leading-relaxed line-clamp-3">{artwork.content}</p>
                    </div>
                    <div className="text-right mt-4">
                      <span className="text-xs text-purple-500 font-medium">点击阅读更多</span>
                    </div>
                  </div>
                )}

                {/* 音频类型卡片 */}
                {artwork.type === 'audio' && (
                  <div className="relative w-full h-full p-6 flex flex-col justify-between bg-gradient-to-br from-green-50 to-teal-50">
                    <div className="absolute top-4 left-4">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <i className="fas fa-music text-white text-sm"></i>
                      </div>
                    </div>
                    
                    {/* 音频波形可视化 */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="flex items-end space-x-1">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="w-1 bg-green-400 rounded-full animate-pulse"
                            style={{
                              height: `${Math.random() * 20 + 10}px`,
                              animationDelay: `${i * 100}ms`
                            }}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 mb-2">{artwork.title}</h3>
                      <p className="text-sm text-slate-600 mb-2">{artwork.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-green-600 font-medium">{artwork.duration}</span>
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <i className="fas fa-play text-white text-xs"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 悬停时显示的外部链接图标 */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                  <i className="fas fa-external-link-alt text-white text-xs"></i>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Tab导航 */}
      <TabBar />
    </div>
  );
}