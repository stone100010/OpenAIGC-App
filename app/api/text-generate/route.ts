import { NextRequest, NextResponse } from 'next/server';

const BASE_URL = 'https://api-inference.modelscope.cn/v1';
const API_KEY = process.env.MODELSCOPE_API_KEY;

// 文本生成类型
type GenerationType = 'copywriting' | 'code';

interface TextGenerateRequest {
  prompt: string;
  type: GenerationType;
  model?: string;
  enableThinking?: boolean;
  stream?: boolean;
  // 文案生成特定参数
  copywritingStyle?: string;
  // 代码生成特定参数
  language?: string;
}

// 系统提示词配置
const systemPrompts: Record<GenerationType, (params: TextGenerateRequest) => string> = {
  copywriting: (params) => `你是一位专业的文案创作专家，精通各类商业文案、营销内容和创意写作。

你的任务是根据用户的需求创作高质量的文案内容。

文案风格要求：${params.copywritingStyle || '专业商务'}

创作原则：
1. 内容简洁有力，直击要点
2. 语言生动有感染力
3. 符合目标受众的阅读习惯
4. 注重情感共鸣和价值传递
5. 适当使用修辞手法增强表达效果

请直接输出文案内容，无需额外解释。`,

  code: (params) => `你是一位资深的软件开发工程师，精通多种编程语言和技术栈。

你的任务是根据用户的需求编写高质量的代码。

目标编程语言：${params.language || 'JavaScript'}

编码原则：
1. 代码简洁清晰，易于理解
2. 遵循该语言的最佳实践和编码规范
3. 添加必要的注释说明
4. 考虑边界情况和错误处理
5. 注重代码的可维护性和可扩展性

输出格式要求（严格遵守）：

## 代码实现

\`\`\`${params.language || 'javascript'}
// 在这里输出完整代码
\`\`\`

---

## 实现说明

在这里用简洁的文字解释代码的实现思路和关键点。

注意：必须使用上述格式，代码和说明之间用 --- 分隔线明确分开。`
};

// 流式响应处理
export async function POST(request: NextRequest) {
  try {
    // 检查API密钥配置
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, message: 'ModelScope API密钥未配置' },
        { status: 500 }
      );
    }

    const body: TextGenerateRequest = await request.json();
    const {
      prompt,
      type = 'copywriting',
      model = 'Qwen/Qwen3-32B',
      enableThinking = false,
      stream = true,
      copywritingStyle,
      language
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数：prompt' },
        { status: 400 }
      );
    }

    // 获取系统提示词
    const systemPrompt = systemPrompts[type]({ ...body, copywritingStyle, language });

    console.log('ModelScope 文本生成请求:', {
      type,
      model,
      promptLength: prompt.length,
      enableThinking,
      stream
    });

    // 构建请求体
    const requestBody = {
      model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      stream,
      ...(enableThinking && {
        extra_body: {
          enable_thinking: true
        }
      })
    };

    // 调用 ModelScope API
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ModelScope API错误:', response.status, errorText);
      throw new Error(`ModelScope API请求失败: ${response.status} ${response.statusText}`);
    }

    // 流式响应
    if (stream) {
      const encoder = new TextEncoder();
      const decoder = new TextDecoder();

      const transformStream = new TransformStream({
        async transform(chunk, controller) {
          const text = decoder.decode(chunk);
          const lines = text.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') {
                controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
                continue;
              }

              try {
                const json = JSON.parse(data);
                const content = json.choices?.[0]?.delta?.content || '';
                const reasoningContent = json.choices?.[0]?.delta?.reasoning_content || '';

                if (content || reasoningContent) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({
                    content,
                    reasoning: reasoningContent
                  })}\n\n`));
                }
              } catch {
                // 忽略解析错误
              }
            }
          }
        }
      });

      const readableStream = response.body?.pipeThrough(transformStream);

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    }

    // 非流式响应
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return NextResponse.json({
      success: true,
      data: {
        content,
        model,
        type,
        usage: data.usage
      },
      message: '生成成功'
    });

  } catch (error) {
    console.error('文本生成请求失败:', error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '文本生成请求失败'
      },
      { status: 500 }
    );
  }
}
