import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      name, 
      description, 
      script, 
      duration,
      appearance,
      voice,
      behavior
    } = body;

    if (!name || !script) {
      return NextResponse.json(
        { error: '请提供数字人名称和演讲内容' },
        { status: 400 }
      );
    }

    // 模拟AI处理过程
    await new Promise(resolve => setTimeout(resolve, 5000));

    // 假设这里调用真实的AI数字人服务
    // const videoResult = await callDigitalHumanAIService({ name, script, appearance, voice, behavior });

    const formatTime = (seconds: number): string => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const mockResult = {
      id: Date.now().toString(),
      name: name,
      description: description || `${name}是一个专业的AI数字人，具有专业的形象和自然的表达能力。`,
      appearance: appearance || {
        avatar: 'professional',
        hairstyle: 'business',
        clothing: 'suit',
        accessories: []
      },
      voice: voice || {
        style: 'professional',
        speed: 1.0,
        pitch: 1.0,
        emotion: 'neutral'
      },
      behavior: behavior || {
        gestures: ['natural'],
        expressions: ['neutral'],
        movement: 'static'
      },
      script: script,
      videoUrl: 'data:video/mp4;base64,',
      thumbnail: `data:image/svg+xml;base64,${btoa(`
        <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
          <rect width="100%" height="100%" fill="#f1f5f9"/>
          <circle cx="200" cy="120" r="60" fill="#94a3b8"/>
          <rect x="150" y="180" width="100" height="80" rx="10" fill="#64748b"/>
          <text x="200" y="280" text-anchor="middle" fill="#64748b" font-size="14" font-family="Arial">${name}</text>
        </svg>
      `)}`,
      date: new Date().toISOString().split('T')[0],
      duration: formatTime(parseInt(duration || '30'))
    };

    return NextResponse.json({
      success: true,
      data: mockResult
    });

  } catch (error) {
    console.error('数字人生成失败:', error);
    return NextResponse.json(
      { error: '数字人生成失败' },
      { status: 500 }
    );
  }
}