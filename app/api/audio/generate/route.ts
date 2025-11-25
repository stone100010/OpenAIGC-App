import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text, voice, speed, quality } = body;

    if (!text || !voice) {
      return NextResponse.json(
        { error: 'Missing required parameters: text, voice' },
        { status: 400 }
      );
    }

    const apiToken = process.env.NEXT_PUBLIC_POLLINATIONS_TOKEN;
    if (!apiToken) {
      return NextResponse.json(
        { error: 'API token not configured' },
        { status: 500 }
      );
    }

    // 编码文本
    const encodedText = encodeURIComponent(text);
    
    // 构建API URL
    const apiUrl = `https://text.pollinations.ai/${encodedText}?model=openai-audio&voice=${voice}&token=${apiToken}`;

    console.log('代理请求:', { text, voice, speed, quality, apiUrl: apiUrl.replace(apiToken, '[TOKEN]') });

    // 发送请求到Pollinations API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': 'audio/mpeg,audio/wav,audio/*',
        'Authorization': `Bearer ${apiToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    // 获取音频数据
    const audioBlob = await response.blob();
    
    // 检查是否是有效的音频数据
    if (audioBlob.size === 0) {
      throw new Error('获取到空的音频数据');
    }
    
    if (!audioBlob.type.startsWith('audio/')) {
      console.warn('返回的数据不是音频格式:', audioBlob.type);
      throw new Error('返回数据不是音频格式');
    }

    // 将音频数据转换为base64
    const arrayBuffer = await audioBlob.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    const base64Audio = btoa(String.fromCharCode(...Array.from(uint8Array)));
    const dataUrl = `data:${audioBlob.type};base64,${base64Audio}`;

    console.log('音频生成成功:', { size: audioBlob.size, type: audioBlob.type });

    return NextResponse.json({
      success: true,
      audioUrl: dataUrl,
      type: audioBlob.type,
      size: audioBlob.size,
      message: '音频生成成功'
    });

  } catch (error) {
    console.error('代理API调用失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: 'API调用失败，请重试'
      },
      { status: 500 }
    );
  }
}