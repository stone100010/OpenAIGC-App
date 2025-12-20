'use client';

import { useState, useEffect } from 'react';
import TabBar from '@/components/ui/TabBar';
import GlassCard from '@/components/ui/GlassCard';
import { ProtectedRoute } from '@/components/auth';
import {
  Users,
  FileText,
  Mic,
  Upload,
  Download,
  Share,
  Heart,
  Play,
  Pause,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface MeetingNote {
  id: string;
  title: string;
  content: string;
  actionItems: string[];
  participants: string[];
  duration: string;
  date: string;
  audioUrl?: string;
}

function MeetingNotesContent() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [meetingNote, setMeetingNote] = useState<MeetingNote | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [participants, setParticipants] = useState('');
  const [meetingDate, setMeetingDate] = useState(new Date().toISOString().split('T')[0]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  // 录音计时器
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
      setError(null);
    } else {
      setError('请选择音频文件');
    }
  };

  const handleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // 这里可以添加停止录音的逻辑
    } else {
      setIsRecording(true);
      setRecordingTime(0);
      // 这里可以添加开始录音的逻辑
    }
  };

  const handleProcess = async () => {
    if (!transcript.trim() && !audioFile) {
      setError('请输入会议内容或上传音频文件');
      return;
    }

    setIsProcessing(true);
    setProgress('正在分析会议内容...');
    setError(null);

    try {
      setProgress('正在分析会议内容...');

      // 调用会议纪要API
      const response = await fetch('/api/meeting-notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: meetingTitle,
          participants: participants,
          date: meetingDate,
          duration: audioFile ? '45:30' : formatTime(recordingTime),
          transcript: transcript.trim(),
          audioFile: audioFile ? {
            name: audioFile.name,
            size: audioFile.size,
            type: audioFile.type
          } : null
        }),
      });

      const result = await response.json();

      if (result.success) {
        setMeetingNote(result.data);
        setProgress('会议纪要生成完成！');
      } else {
        throw new Error(result.error || '生成失败');
      }

      setIsProcessing(false);

    } catch (error) {
      console.error('处理失败:', error);
      setError(error instanceof Error ? error.message : '处理会议内容时出现错误，请重试');
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!meetingNote) return;
    
    const content = `# ${meetingNote.title}\n\n**日期：** ${meetingNote.date}\n**参会人员：** ${meetingNote.participants.join(', ')}\n**会议时长：** ${meetingNote.duration}\n\n${meetingNote.content}\n\n## 行动项\n${meetingNote.actionItems.map(item => `- [ ] ${item}`).join('\n')}`;
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${meetingNote.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share && meetingNote) {
      navigator.share({
        title: meetingNote.title,
        text: `会议纪要：${meetingNote.title}`,
        url: window.location.href
      }).catch(console.error);
    } else if (meetingNote) {
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
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-2 flex items-center">
            <Users className="mr-4 text-purple-500 text-4xl" />
            智能会议纪要
          </h1>
          <p className="text-slate-600 text-lg">自动生成专业的会议纪要和行动项</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：主要控制区域 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 输入控制面板 */}
            <GlassCard className="hover:shadow-xl transition-shadow duration-300">
              <div className="space-y-6">
                {/* 会议基本信息 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      会议标题
                    </label>
                    <input
                      type="text"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                      placeholder="输入会议标题..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-800 mb-2">
                      会议日期
                    </label>
                    <input
                      type="date"
                      value={meetingDate}
                      onChange={(e) => setMeetingDate(e.target.value)}
                      className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    参会人员（用逗号分隔）
                  </label>
                  <input
                    type="text"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                    className="w-full p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-slate-200/50 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all"
                    placeholder="张三, 李四, 王五..."
                  />
                </div>

                {/* 录音/上传区域 */}
                <div className="border-2 border-dashed border-slate-300 rounded-xl p-6">
                  <div className="text-center">
                    <div className="flex justify-center space-x-4 mb-4">
                      {/* 录音按钮 */}
                      <button
                        onClick={handleRecording}
                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                          isRecording
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                            : 'bg-purple-500 hover:bg-purple-600'
                        }`}
                      >
                        <Mic className="w-6 h-6 text-white" />
                      </button>
                      
                      {/* 文件上传 */}
                      <label className="w-16 h-16 bg-slate-500 hover:bg-slate-600 rounded-full flex items-center justify-center cursor-pointer transition-all">
                        <Upload className="w-6 h-6 text-white" />
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-slate-700">
                        {isRecording ? `录音中... ${formatTime(recordingTime)}` : '录音或上传音频文件'}
                      </p>
                      <p className="text-xs text-slate-500">
                        {audioFile ? `已选择: ${audioFile.name}` : '支持 MP3, WAV, M4A 等格式'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 文本输入区域 */}
                <div>
                  <label className="block text-lg font-semibold text-slate-800 mb-3">
                    或直接输入会议内容
                  </label>
                  <textarea
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    className="w-full p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all text-base"
                    placeholder="输入会议记录的文字内容，或者让AI帮您转录音频文件..."
                  />
                </div>

                {/* 处理按钮 */}
                <button
                  onClick={handleProcess}
                  disabled={isProcessing || (!transcript.trim() && !audioFile)}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${
                    isProcessing || (!transcript.trim() && !audioFile)
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      处理中...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      生成会议纪要
                    </>
                  )}
                </button>
              </div>
            </GlassCard>

            {/* 生成结果展示 */}
            {(meetingNote || isProcessing || error) && (
              <GlassCard className="hover:shadow-xl transition-shadow duration-300">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-slate-800 mb-4">生成结果</h3>
                  
                  {isProcessing ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                      <p className="text-slate-600 mb-2">正在生成会议纪要...</p>
                      <p className="text-sm text-slate-500 mb-2">{progress}</p>
                      <p className="text-xs text-slate-400">AI正在分析您的会议内容，请耐心等待</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                      </div>
                      <p className="text-red-600 mb-2">处理失败</p>
                      <p className="text-sm text-slate-600 mb-4 text-center max-w-md">{error}</p>
                      <button 
                        onClick={handleProcess}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                      >
                        重新尝试
                      </button>
                    </div>
                  ) : meetingNote ? (
                    <div className="space-y-6">
                      {/* 会议信息 */}
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 text-left">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-xl font-bold text-slate-800">{meetingNote.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {meetingNote.duration}
                            </span>
                            <span>{meetingNote.date}</span>
                          </div>
                        </div>
                        
                        {meetingNote.participants.length > 0 && (
                          <div className="mb-4">
                            <span className="text-sm font-medium text-slate-700">参会人员：</span>
                            <span className="text-sm text-slate-600 ml-2">
                              {meetingNote.participants.join(', ')}
                            </span>
                          </div>
                        )}
                        
                        <div className="prose prose-sm max-w-none text-slate-700">
                          <div dangerouslySetInnerHTML={{ __html: meetingNote.content.replace(/\n/g, '<br>') }} />
                        </div>
                      </div>

                      {/* 行动项 */}
                      {meetingNote.actionItems.length > 0 && (
                        <div className="bg-slate-50 rounded-xl p-6 text-left">
                          <h4 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
                            <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                            行动项
                          </h4>
                          <div className="space-y-3">
                            {meetingNote.actionItems.map((item, index) => (
                              <div key={index} className="flex items-start space-x-3 p-3 bg-white rounded-lg border">
                                <input 
                                  type="checkbox" 
                                  className="mt-1 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                                />
                                <span className="text-slate-700 flex-1">{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* 操作按钮 */}
                      <div className="flex gap-3">
                        <button 
                          onClick={handleDownload}
                          className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          下载
                        </button>
                        <button 
                          onClick={handleShare}
                          className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
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

          {/* 右侧：模板和提示 */}
          <div>
            <GlassCard className="h-full hover:shadow-xl transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-slate-800 mb-6">会议模板</h3>
              <div className="space-y-4">
                {[
                  { title: '周例会', desc: '部门工作汇报', participants: '5-10人' },
                  { title: '项目启动会', desc: '项目规划和分工', participants: '10-20人' },
                  { title: '客户沟通会', desc: '需求确认和讨论', participants: '3-8人' },
                  { title: '技术评审会', desc: '技术方案讨论', participants: '5-15人' }
                ].map((template, index) => (
                  <div 
                    key={index} 
                    className="group cursor-pointer p-4 bg-slate-50 hover:bg-purple-50 rounded-xl transition-colors duration-300"
                    onClick={() => setMeetingTitle(template.title)}
                  >
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                        <Users className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-800 group-hover:text-purple-600">
                          {template.title}
                        </h4>
                        <p className="text-xs text-slate-500">{template.participants}</p>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">{template.desc}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* 核心功能 */}
        <div className="mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 智能转录 */}
            <div className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-purple-800 mb-3">智能转录</h4>
                <p className="text-purple-700 text-sm mb-4 leading-relaxed">高精度语音识别，支持多语言和方言，准确率达95%以上</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-purple-600">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    <span>多语言支持</span>
                  </div>
                  <div className="flex items-center text-xs text-purple-600">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    <span>实时转录</span>
                  </div>
                  <div className="flex items-center text-xs text-purple-600">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    <span>噪音过滤</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 智能摘要 */}
            <div className="group">
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-indigo-800 mb-3">智能摘要</h4>
                <p className="text-indigo-700 text-sm mb-4 leading-relaxed">AI自动提取关键信息，生成结构化的会议纪要</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-indigo-600">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    <span>关键信息提取</span>
                  </div>
                  <div className="flex items-center text-xs text-indigo-600">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    <span>结构化整理</span>
                  </div>
                  <div className="flex items-center text-xs text-indigo-600">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    <span>智能分类</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 行动项 */}
            <div className="group">
              <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 h-full hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h4 className="text-lg font-bold text-pink-800 mb-3">行动项管理</h4>
                <p className="text-pink-700 text-sm mb-4 leading-relaxed">自动识别和提取行动项，支持任务分配和跟踪</p>
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-pink-600">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    <span>任务自动提取</span>
                  </div>
                  <div className="flex items-center text-xs text-pink-600">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    <span>责任人识别</span>
                  </div>
                  <div className="flex items-center text-xs text-pink-600">
                    <CheckCircle className="w-3 h-3 mr-2" />
                    <span>进度跟踪</span>
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

export default function MeetingNotesPage() {
  return (
    <ProtectedRoute>
      <MeetingNotesContent />
    </ProtectedRoute>
  );
}