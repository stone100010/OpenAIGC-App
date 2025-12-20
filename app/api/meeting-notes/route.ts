import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, participants, date, duration, transcript, audioFile } = body;

    if (!transcript && !audioFile) {
      return NextResponse.json(
        { error: '请提供会议内容或音频文件' },
        { status: 400 }
      );
    }

    // 模拟AI处理过程
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 假设这里调用真实的AI服务
    // const aiResult = await callAIService({ transcript, audioFile });

    const mockResult = {
      id: Date.now().toString(),
      title: title || '会议纪要',
      content: `## ${title || '会议纪要'}

### 会议摘要
本次会议主要讨论了项目进展情况，各部门负责人汇报了当前工作状态。

### 主要讨论内容：
1. 项目进度汇报
2. 资源分配问题  
3. 下一步工作计划

### 关键决策：
- 确定项目上线时间
- 调整人员配置
- 优化工作流程

### 后续跟进：
各部门需要在周五前提交详细的工作计划。`,
      actionItems: [
        '张三负责跟进技术方案优化',
        '李四协调资源分配问题', 
        '王五准备下周的工作汇报',
        '赵六整理会议文档并发送给所有参会人员'
      ],
      participants: participants ? participants.split(',').map(p => p.trim()) : [],
      duration: duration || '45:30',
      date: date || new Date().toISOString().split('T')[0]
    };

    return NextResponse.json({
      success: true,
      data: mockResult
    });

  } catch (error) {
    console.error('会议纪要生成失败:', error);
    return NextResponse.json(
      { error: '会议纪要生成失败' },
      { status: 500 }
    );
  }
}