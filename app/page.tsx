import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 品牌Logo区域 */}
        <div className="text-center mb-12">
          {/* SVG Logo动画 */}
          <svg className="w-32 h-32 mx-auto mb-6 animate-bounce" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b"/>
                <stop offset="100%" stopColor="#fbbf24"/>
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="40" stroke="url(#logoGrad)" strokeWidth="3" fill="none" strokeLinecap="round">
              <animate attributeName="r" values="35;40;35" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="stroke-width" values="2;3;2" dur="2s" repeatCount="indefinite"/>
            </circle>
            <text x="50" y="55" textAnchor="middle" fill="url(#logoGrad)" fontSize="24" fontWeight="bold" fontFamily="Poppins">AI</text>
          </svg>
          
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-4">
            OpenAIGC
          </h1>
          <p className="text-lg text-slate-600 font-medium leading-relaxed">
            欢迎来到AI创作新时代
          </p>
        </div>

        {/* 功能介绍卡片 */}
        <div className="space-y-4 mb-8">
          {/* 图像生成 - 左对齐 */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-palette text-white"></i>
              </div>
              <h3 className="font-semibold text-slate-800">图像生成</h3>
            </div>
            <p className="text-sm text-slate-600">AI驱动的一键图像创作</p>
          </div>
          
          {/* 音频合成 - 内容右对齐，卡片全宽 */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-end mb-3">
              <h3 className="font-semibold text-slate-800 mr-3">音频合成</h3>
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-full flex items-center justify-center">
                <i className="fas fa-music text-white"></i>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">智能语音和音乐创作</p>
            </div>
          </div>
          
          {/* 视频制作 - 左对齐 */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mr-3">
                <i className="fas fa-video text-white"></i>
              </div>
              <h3 className="font-semibold text-slate-800">视频制作</h3>
            </div>
            <p className="text-sm text-slate-600">专业级AI视频生成</p>
          </div>
        </div>

        {/* 开始按钮 */}
        <Link href="/home">
          <button className="w-full bg-gradient-to-r from-primary to-orange-400 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
            <span>开始创作之旅</span>
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </Link>
      </div>
    </div>
  );
}