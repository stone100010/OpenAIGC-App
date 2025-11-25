import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(request: NextRequest) {
  let client: Client | null = null;
  
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 连接到数据库
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();

    // 简单的查询
    let query = 'SELECT * FROM creative_works WHERE is_public = true';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (type && ['image', 'video', 'text', 'audio'].includes(type)) {
      query += ` AND content_type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    queryParams.push(limit, offset);

    const result = await client.query(query, queryParams);

    // 格式化数据
    const formattedWorks = result.rows.map(row => ({
      id: row.id,
      title: row.title,
      description: row.description,
      content_type: row.content_type,
      content_data: row.content_data,
      media_url: row.media_url,
      thumbnail_url: row.thumbnail_url,
      tags: row.tags || [],
      duration: row.duration,
      views_count: row.views_count,
      likes_count: row.likes_count,
      created_at: row.created_at,
      creator: {
        username: 'odyssey', // 临时使用固定用户名
        display_name: 'odyssey'
      }
    }));

    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM creative_works WHERE is_public = true';
    const countParams: any[] = [];

    if (type && ['image', 'video', 'text', 'audio'].includes(type)) {
      countQuery += ' AND content_type = $1';
      countParams.push(type);
    }

    const countResult = await client.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].total);

    return NextResponse.json({
      success: true,
      data: {
        works: formattedWorks,
        pagination: {
          total: totalCount,
          limit,
          offset,
          hasMore: offset + limit < totalCount
        },
        stats: {
          total: totalCount,
          image: formattedWorks.filter(w => w.content_type === 'image').length,
          video: formattedWorks.filter(w => w.content_type === 'video').length,
          text: formattedWorks.filter(w => w.content_type === 'text').length,
          audio: formattedWorks.filter(w => w.content_type === 'audio').length
        }
      },
      message: '创作作品获取成功'
    });

  } catch (error) {
    console.error('获取创作作品失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '获取创作作品失败'
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end();
    }
  }
}