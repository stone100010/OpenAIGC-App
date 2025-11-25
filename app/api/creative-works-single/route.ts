import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: '作品ID参数缺失' },
        { status: 400 }
      );
    }

    // 数据库连接
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();

    // 获取单个作品详情
    const query = `
      SELECT 
        cw.id,
        cw.title,
        cw.description,
        cw.content_type,
        cw.content_data,
        cw.media_url,
        cw.thumbnail_url,
        cw.tags,
        cw.duration,
        cw.views_count,
        cw.likes_count,
        cw.created_at,
        u.username as creator_username,
        u.email as creator_email
      FROM creative_works cw
      LEFT JOIN users u ON cw.creator_id = u.id
      WHERE cw.id = $1 AND cw.is_public = true
    `;

    const result = await client.query(query, [id]);

    await client.end();

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: '作品不存在或未公开' },
        { status: 404 }
      );
    }

    const work = result.rows[0];

    // 格式化响应数据
    const formattedWork = {
      id: work.id,
      title: work.title,
      description: work.description,
      content_type: work.content_type,
      content_data: work.content_data,
      media_url: work.media_url,
      thumbnail_url: work.thumbnail_url,
      tags: work.tags || [],
      duration: work.duration,
      views_count: work.views_count,
      likes_count: work.likes_count,
      created_at: work.created_at,
      creator: {
        username: work.creator_username,
        email: work.creator_email
      }
    };

    return NextResponse.json({
      success: true,
      data: formattedWork,
      message: '作品详情获取成功'
    });

  } catch (error) {
    console.error('获取作品详情失败:', error);
    return NextResponse.json(
      { success: false, message: '服务器内部错误' },
      { status: 500 }
    );
  }
}