import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(request: NextRequest) {
  let client: Client | null = null;
  
  try {
    // 获取查询参数
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'image', 'video', 'text', 'audio'
    const authorId = searchParams.get('author_id'); // 作者ID
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const featured = searchParams.get('featured') === 'true';
    const sort = searchParams.get('sort') || 'created_at.desc'; // 排序方式

    // 连接到数据库
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();

    // 构建查询条件
    const conditions = ['cw.is_public = true'];
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (type && ['image', 'video', 'text', 'audio'].includes(type)) {
      conditions.push(`cw.content_type = $${paramIndex}`);
      queryParams.push(type);
      paramIndex++;
    }

    if (authorId) {
      conditions.push(`cw.creator_id = $${paramIndex}`);
      queryParams.push(authorId);
      paramIndex++;
    }

    if (featured) {
      conditions.push('cw.is_featured = true');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // 处理排序
    const sortOptions = {
      'created_at.desc': 'ORDER BY cw.created_at DESC',
      'created_at.asc': 'ORDER BY cw.created_at ASC',
      'views_count.desc': 'ORDER BY cw.views_count DESC',
      'likes_count.desc': 'ORDER BY cw.likes_count DESC'
    };
    const orderByClause = sortOptions[sort as keyof typeof sortOptions] || sortOptions['created_at.desc'];

    // 查询创作作品
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
        cw.file_size,
        cw.views_count,
        cw.likes_count,
        cw.created_at,
        cw.updated_at,
        u.username as creator_username,
        u.email as creator_email,
        cc.name_cn as category_name,
        cc.icon as category_icon,
        cc.color as category_color
      FROM creative_works cw
      LEFT JOIN users u ON cw.creator_id = u.id
      LEFT JOIN creative_categories cc ON cw.content_type = cc.name
      ${whereClause}
      ${orderByClause}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;

    queryParams.push(limit, offset);

    const result = await client.query(query, queryParams);

    // 格式化返回数据
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
      file_size: row.file_size,
      views_count: row.views_count,
      likes_count: row.likes_count,
      created_at: row.created_at,
      updated_at: row.updated_at,
      creator: {
        username: row.creator_username,
        display_name: row.creator_username
      },
      category: row.category_name ? {
        name: row.category_name,
        icon: row.category_icon,
        color: row.category_color
      } : null
    }));

    // 获取总数
    const countConditions = ['is_public = true'];
    const countParams: any[] = [];
    let countParamIndex = 1;

    if (type && ['image', 'video', 'text', 'audio'].includes(type)) {
      countConditions.push(`content_type = $${countParamIndex}`);
      countParams.push(type);
      countParamIndex++;
    }

    if (authorId) {
      countConditions.push(`creator_id = $${countParamIndex}`);
      countParams.push(authorId);
      countParamIndex++;
    }

    if (featured) {
      countConditions.push('is_featured = true');
    }

    const countWhereClause = countConditions.length > 0 ? `WHERE ${countConditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*) as total
      FROM creative_works
      ${countWhereClause};
    `;
    const countResult = await client.query(countQuery, countParams);
    const totalCount = parseInt(countResult.rows[0].total);

    // 获取各类型统计
    const statsQuery = `
      SELECT content_type, COUNT(*) as count
      FROM creative_works
      WHERE is_public = true
      GROUP BY content_type;
    `;
    const statsResult = await client.query(statsQuery);
    
    const stats = statsResult.rows.reduce((acc, stat) => {
      acc[stat.content_type] = parseInt(stat.count);
      return acc;
    }, {} as Record<string, number>);

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
          image: stats.image || 0,
          video: stats.video || 0,
          text: stats.text || 0,
          audio: stats.audio || 0
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

// 创建创作作品
export async function POST(request: NextRequest) {
  let client: Client | null = null;
  
  try {
    const body = await request.json();
    const { title, description, content_type, content_data, media_url, thumbnail_url, tags, duration, file_size } = body;

    if (!title || !description || !content_type) {
      return NextResponse.json(
        { error: '缺少必要参数', message: '标题、描述和内容类型为必填项' },
        { status: 400 }
      );
    }

    // 验证内容类型
    if (!['image', 'video', 'text', 'audio'].includes(content_type)) {
      return NextResponse.json(
        { error: '无效的内容类型', message: '内容类型必须是 image、video、text 或 audio' },
        { status: 400 }
      );
    }

    // 连接到数据库
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();

    // 获取管理员用户ID
    const adminResult = await client.query(
      'SELECT id FROM users WHERE username = $1',
      ['Odyssey Warsaw']
    );

    if (adminResult.rows.length === 0) {
      return NextResponse.json(
        { error: '用户不存在', message: '找不到管理员用户' },
        { status: 404 }
      );
    }

    const creatorId = adminResult.rows[0].id;

    // 创建创作作品
    const insertQuery = `
      INSERT INTO creative_works (
        creator_id, title, description, content_type, 
        content_data, media_url, thumbnail_url, tags, duration, file_size,
        is_public, is_featured, views_count, likes_count
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
        true, false, 0, 0
      ) RETURNING *;
    `;

    const insertValues = [
      creatorId,
      title,
      description,
      content_type,
      content_data,
      media_url,
      thumbnail_url,
      tags,
      duration,
      file_size
    ];

    const result = await client.query(insertQuery, insertValues);
    const creativeWork = result.rows[0];

    return NextResponse.json({
      success: true,
      data: creativeWork,
      message: '创作作品创建成功'
    });

  } catch (error) {
    console.error('创建创作作品失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '创建创作作品失败'
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end();
    }
  }
}

// 删除创作作品
export async function DELETE(request: NextRequest) {
  let client: Client | null = null;
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: '缺少作品ID参数' },
        { status: 400 }
      );
    }

    // 连接到数据库
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    await client.connect();

    // 检查作品是否存在
    const checkQuery = 'SELECT id, title FROM creative_works WHERE id = $1';
    const checkResult = await client.query(checkQuery, [id]);

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: '作品不存在' },
        { status: 404 }
      );
    }

    // 删除作品
    const deleteQuery = 'DELETE FROM creative_works WHERE id = $1';
    await client.query(deleteQuery, [id]);

    console.log('创作作品已删除:', { id, title: checkResult.rows[0].title });

    return NextResponse.json({
      success: true,
      message: '创作作品删除成功'
    });

  } catch (error) {
    console.error('删除创作作品失败:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '删除创作作品失败'
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end();
    }
  }
}