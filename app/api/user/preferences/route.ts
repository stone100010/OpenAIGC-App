import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  let client: Client | null = null;

  try {
    // 从请求头中获取用户ID
    let userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: '未授权访问' },
        { status: 401 }
      );
    }

    // 如果是旧格式的ID（user_xxx格式），尝试映射到数据库中存在的用户
    if (userId.startsWith('user_')) {
      // 使用数据库中存在的odyssey用户ID作为默认
      userId = 'ad57ef07-8446-472f-9fda-c0068798a2e0';
      console.log('[User Preferences API] 检测到旧格式用户ID，已映射到odyssey用户:', { originalId: request.headers.get('x-user-id'), mappedId: userId });
    }

    // 验证UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { success: false, message: '无效的用户ID格式' },
        { status: 400 }
      );
    }

    console.log('[User Preferences API] 获取用户偏好:', { userId });

    // 连接到数据库
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 5000
    });

    const connectStart = Date.now();
    await client.connect();
    console.log(`[User Preferences API] 数据库连接耗时: ${Date.now() - connectStart}ms`);

    // 查询用户偏好设置
    const queryStart = Date.now();
    const query = `
      SELECT setting_key, setting_value
      FROM user_preferences
      WHERE user_id = $1
    `;

    const result = await client.query(query, [userId]);
    console.log(`[User Preferences API] 查询耗时: ${Date.now() - queryStart}ms`);

    // 构建偏好设置对象
    const preferences: any = {};
    
    // 默认偏好设置
    const defaultPreferences = {
      emailNotifications: true,
      pushNotifications: true,
      marketingEmails: false,
      weeklyReport: true,
      newFeatures: true,
      language: 'zh-CN',
      theme: 'light',
      autoSave: true,
      highQualityExport: true,
      showTutorials: true
    };

    // 合并数据库中的设置
    result.rows.forEach(row => {
      try {
        preferences[row.setting_key] = JSON.parse(row.setting_value);
      } catch (e) {
        preferences[row.setting_key] = row.setting_value;
      }
    });

    // 填充默认值
    const finalPreferences = { ...defaultPreferences, ...preferences };

    const totalTime = Date.now() - startTime;
    console.log(`[User Preferences API] 请求完成，总耗时: ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      data: finalPreferences,
      message: '用户偏好获取成功'
    });

  } catch (error) {
    console.error('[User Preferences API] 获取用户偏好失败:', error);
    console.error(`[User Preferences API] 失败耗时: ${Date.now() - startTime}ms`);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '获取用户偏好失败'
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        console.error('[User Preferences API] 关闭连接失败:', e);
      }
    }
  }
}

export async function PUT(request: NextRequest) {
  const startTime = Date.now();
  let client: Client | null = null;

  try {
    // 从请求头中获取用户ID
    let userId = request.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json(
        { success: false, message: '未授权访问' },
        { status: 401 }
      );
    }

    // 如果是旧格式的ID（user_xxx格式），尝试映射到数据库中存在的用户
    if (userId.startsWith('user_')) {
      // 使用数据库中存在的odyssey用户ID作为默认
      userId = 'ad57ef07-8446-472f-9fda-c0068798a2e0';
      console.log('[User Preferences API] 检测到旧格式用户ID，已映射到odyssey用户:', { originalId: request.headers.get('x-user-id'), mappedId: userId });
    }

    // 验证UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { success: false, message: '无效的用户ID格式' },
        { status: 400 }
      );
    }

    // 获取请求体数据
    const body = await request.json();
    const preferences = body;

    console.log('[User Preferences API] 更新用户偏好:', { 
      userId, 
      preferences: Object.keys(preferences) 
    });

    // 连接到数据库
    client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      connectionTimeoutMillis: 5000
    });

    const connectStart = Date.now();
    await client.connect();
    console.log(`[User Preferences API] 数据库连接耗时: ${Date.now() - connectStart}ms`);

    // 启动事务
    await client.query('BEGIN');

    // 批量更新偏好设置
    const updateStart = Date.now();
    for (const [key, value] of Object.entries(preferences)) {
      const upsertQuery = `
        INSERT INTO user_preferences (user_id, setting_key, setting_value, updated_at)
        VALUES ($1, $2, $3, NOW())
        ON CONFLICT (user_id, setting_key)
        DO UPDATE SET 
          setting_value = EXCLUDED.setting_value,
          updated_at = NOW()
      `;

      await client.query(upsertQuery, [userId, key, JSON.stringify(value)]);
    }

    console.log(`[User Preferences API] 偏好更新耗时: ${Date.now() - updateStart}ms`);

    // 提交事务
    await client.query('COMMIT');

    const totalTime = Date.now() - startTime;
    console.log(`[User Preferences API] 请求完成，总耗时: ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      data: preferences,
      message: '用户偏好更新成功'
    });

  } catch (error) {
    console.error('[User Preferences API] 更新用户偏好失败:', error);
    
    // 回滚事务
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('[User Preferences API] 回滚失败:', rollbackError);
      }
    }

    console.error(`[User Preferences API] 失败耗时: ${Date.now() - startTime}ms`);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '更新用户偏好失败'
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        console.error('[User Preferences API] 关闭连接失败:', e);
      }
    }
  }
}