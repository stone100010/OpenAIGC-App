import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

const BASE_URL = 'https://api-inference.modelscope.cn/';
const API_KEY = process.env.MODELSCOPE_API_KEY;

const COMMON_HEADERS = {
  "Authorization": `Bearer ${API_KEY}`,
  "Content-Type": "application/json",
};

// 类型定义
interface GenerateRequest {
  prompt: string;
  model?: string;
  loras?: string | Record<string, number>;
  width?: number;
  height?: number;
  steps?: number;
  guidance_scale?: number;
  seed?: number;
}

interface TaskResponse {
  task_id: string;
  task_status: string;
  output_images?: string[];
  error_message?: string;
}

// 创建图像生成任务
export async function POST(request: NextRequest) {
  try {
    // 检查API密钥配置
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, message: 'ModelScope API密钥未配置' },
        { status: 500 }
      );
    }

    const body: GenerateRequest = await request.json();
    const { 
      prompt, 
      model = "Tongyi-MAI/Z-Image-Turbo", 
      loras, 
      width = 1024,        // 官方推荐尺寸
      height = 1024,       // 官方推荐尺寸
      steps = 9,           // 官方推荐步数
      guidance_scale = 0.0, // 官方推荐：Turbo版本不使用CFG引导
      seed 
    } = body;

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: '缺少必要参数：prompt' },
        { status: 400 }
      );
    }

    // 构建请求数据
    const requestData: any = {
      model,
      prompt: prompt,
      width,
      height,
      steps,
      guidance_scale
    };

    // 添加LoRA配置（可选）
    if (loras) {
      requestData.loras = loras;
    }

    // 添加种子（可选）
    if (seed !== undefined) {
      requestData.seed = seed;
    }

    console.log('ModelScope API请求:', { 
      model, 
      prompt: prompt.substring(0, 50) + '...', 
      width, 
      height,
      aspect_ratio: width === height ? '1:1 (square)' : `${width}:${height}`,
      hasLoRA: !!loras,
      full_params: { prompt, model, width, height, steps, guidance_scale }
    });

    // 创建生成任务
    const response = await fetch(`${BASE_URL}v1/images/generations`, {
      method: 'POST',
      headers: {
        ...COMMON_HEADERS,
        "X-ModelScope-Async-Mode": "true"
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ModelScope API错误:', response.status, errorText);
      throw new Error(`ModelScope API请求失败: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const taskId = data.task_id;

    console.log('任务创建成功:', { taskId, status: data.task_status });

    return NextResponse.json({
      success: true,
      data: {
        task_id: taskId,
        status: 'processing',
        message: '图像生成任务已创建，请使用task_id查询生成结果'
      },
      message: '任务创建成功'
    });

  } catch (error) {
    console.error('图像生成请求失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '图像生成请求失败'
      },
      { status: 500 }
    );
  }
}

// 查询任务状态和结果
export async function GET(request: NextRequest) {
  try {
    // 检查API密钥配置
    if (!API_KEY) {
      return NextResponse.json(
        { success: false, message: 'ModelScope API密钥未配置' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get('task_id');

    if (!taskId) {
      return NextResponse.json(
        { success: false, message: '缺少task_id参数' },
        { status: 400 }
      );
    }

    console.log('查询任务状态:', { taskId });

    // 查询任务状态
    const response = await fetch(`${BASE_URL}v1/tasks/${taskId}`, {
      method: 'GET',
      headers: {
        ...COMMON_HEADERS,
        "X-ModelScope-Task-Type": "image_generation"
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('查询任务状态失败:', response.status, errorText);
      throw new Error(`查询任务状态失败: ${response.status} ${response.statusText}`);
    }

    const data: TaskResponse = await response.json();

    console.log('任务状态:', { 
      taskId, 
      status: data.task_status, 
      hasImages: !!data.output_images,
      imageUrl: data.output_images ? data.output_images[0] : null,
      error: data.error_message
    });

    if (data.task_status === "SUCCEED" && data.output_images && data.output_images.length > 0) {
      // 任务成功，返回生成的图像
      const imageUrl = data.output_images[0];
      
      // 保存到数据库（可选）
      try {
        await saveToDatabase(taskId, imageUrl, 'ModelScope Generated');
      } catch (dbError) {
        console.warn('保存到数据库失败:', dbError);
        // 不影响主流程，继续返回结果
      }

      return NextResponse.json({
        success: true,
        data: {
          task_id: taskId,
          status: 'completed',
          image_url: imageUrl,
          message: '图像生成成功'
        },
        message: '图像生成完成'
      });

    } else if (data.task_status === "FAILED") {
      return NextResponse.json({
        success: false,
        data: {
          task_id: taskId,
          status: 'failed',
          error: data.error_message || '图像生成失败'
        },
        message: '图像生成失败'
      }, { status: 400 });

    } else if (data.task_status === "PROCESSING") {
      return NextResponse.json({
        success: true,
        data: {
          task_id: taskId,
          status: 'processing',
          message: '图像正在生成中，请稍后重试'
        },
        message: '处理中'
      });

    } else {
      return NextResponse.json({
        success: true,
        data: {
          task_id: taskId,
          status: data.task_status,
          message: '任务状态未知'
        },
        message: '任务状态: ' + data.task_status
      });
    }

  } catch (error) {
    console.error('查询任务状态失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '查询任务状态失败'
      },
      { status: 500 }
    );
  }
}

// 辅助函数：保存到数据库
async function saveToDatabase(taskId: string, imageUrl: string, description: string) {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();

    // 获取管理员用户ID
    const adminResult = await client.query(
      'SELECT id FROM users WHERE username = $1',
      ['odyssey']
    );

    if (adminResult.rows.length === 0) {
      console.warn('管理员用户不存在，跳过数据库保存');
      return;
    }

    const creatorId = adminResult.rows[0].id;

    // 创建创作作品记录
    const insertQuery = `
      INSERT INTO creative_works (
        creator_id, title, description, content_type, 
        media_url, thumbnail_url, is_public, is_featured, 
        views_count, likes_count, tags
      ) VALUES (
        $1, $2, $3, 'image', $4, $4, 
        true, false, 0, 0, $5
      ) RETURNING id;
    `;

    const insertValues = [
      creatorId,
      `AI生成图像 - ${taskId.substring(0, 8)}`,
      description,
      imageUrl,
      ['ai-generated', 'modelscope']
    ];

    const result = await client.query(insertQuery, insertValues);
    console.log('图像已保存到数据库:', { workId: result.rows[0].id, taskId });

  } catch (error) {
    console.error('保存到数据库失败:', error);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}