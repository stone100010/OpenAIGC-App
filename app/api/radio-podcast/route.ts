import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, voice } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: '请提供标题和内容' },
        { status: 400 }
      );
    }

    // 模拟AI处理过程
    await new Promise(resolve => setTimeout(resolve, 4000));

    // 假设这里调用真实的AI音频生成服务
    // const audioResult = await callAudioAIService({ title, content, voice });

    const formatTime = (minutes: number): string => {
      const mins = Math.floor(minutes);
      const secs = (minutes - mins) * 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const mockResult = {
      id: Date.now().toString(),
      title: title,
      content: content,
      audioUrl: 'data:audio/wav;base64,',
      duration: formatTime(Math.ceil(content.length / 100)),
      voice: voice || 'professional',
      date: new Date().toISOString().split('T')[0]
    };

    return NextResponse.json({
      success: true,
      data: mockResult
    });

  } catch (error) {
    console.error('播客生成失败:', error);
    return NextResponse.json(
      { error: '播客生成失败' },
      { status: 500 }
    );
  }
}