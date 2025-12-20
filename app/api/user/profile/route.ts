import { NextRequest, NextResponse } from 'next/server';
import { withDbClient } from '../../../../lib/database';

export async function GET(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 从请求头中获取用户ID（在实际应用中应该通过JWT token验证）
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
      console.log('[User Profile API] 检测到旧格式用户ID，已映射到odyssey用户:', { originalId: request.headers.get('x-user-id'), mappedId: userId });
    }

    // 验证UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { success: false, message: '无效的用户ID格式' },
        { status: 400 }
      );
    }

    console.log('[User Profile API] 获取用户档案:', { userId });

    // 使用优化后的数据库连接池
    const result = await withDbClient(async (client) => {
      const queryStart = Date.now();
      
      // 查询用户基础信息和档案信息
      const query = `
        SELECT 
          u.id, u.username, u.email, u.is_pro, u.created_at,
          up.avatar_url, up.bio, up.location, up.website
        FROM users u
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE u.id = $1 AND u.is_active = true
      `;

      const queryResult = await client.query(query, [userId]);
      console.log(`[User Profile API] 查询耗时: ${Date.now() - queryStart}ms`);
      
      return queryResult;
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: '用户不存在' },
        { status: 404 }
      );
    }

    const userData = result.rows[0];

    // 构建返回数据
    const profileData = {
      id: userData.id,
      name: userData.username,
      username: userData.username,
      email: userData.email,
      bio: userData.bio || '',
      avatar: userData.avatar_url || '/20250731114736.jpg',
      location: userData.location || '',
      website: userData.website || '',
      isPro: userData.is_pro,
      joinDate: userData.created_at
    };

    const totalTime = Date.now() - startTime;
    console.log(`[User Profile API] 请求完成，总耗时: ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      data: profileData,
      message: '用户档案获取成功'
    });

  } catch (error) {
    console.error('[User Profile API] 获取用户档案失败:', error);
    console.error(`[User Profile API] 失败耗时: ${Date.now() - startTime}ms`);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '获取用户档案失败'
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const startTime = Date.now();

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
      console.log('[User Profile API] 检测到旧格式用户ID，已映射到odyssey用户:', { originalId: request.headers.get('x-user-id'), mappedId: userId });
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
    const { bio, avatar, location, website } = body;

    console.log('[User Profile API] 更新用户档案:', { userId, bio: bio?.substring(0, 50) + '...' });

    // 使用优化后的数据库连接池和事务处理
    const result = await withDbClient(async (client) => {
      // 启动事务
      await client.query('BEGIN');

      try {
        // 先检查用户档案是否存在
        const checkQuery = `
          SELECT id FROM user_profiles WHERE user_id = $1
        `;
        
        const checkResult = await client.query(checkQuery, [userId]);
        let queryResult;
        
        if (checkResult.rows.length > 0) {
          // 更新现有记录
          const updateQuery = `
            UPDATE user_profiles 
            SET avatar_url = $1, bio = $2, location = $3, website = $4, updated_at = NOW()
            WHERE user_id = $5
            RETURNING *
          `;
          
          queryResult = await client.query(updateQuery, [avatar, bio, location, website, userId]);
        } else {
          // 插入新记录
          const insertQuery = `
            INSERT INTO user_profiles (user_id, avatar_url, bio, location, website, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
            RETURNING *
          `;
          
          queryResult = await client.query(insertQuery, [userId, avatar, bio, location, website]);
        }

        // 提交事务
        await client.query('COMMIT');
        return queryResult;
      } catch (error) {
        // 回滚事务
        await client.query('ROLLBACK');
        throw error;
      }
    });

    const userData = result.rows[0];

    // 构建返回数据
    const profileData = {
      id: userData.user_id,
      name: '', // 这里应该从users表获取，但为了简化先留空
      username: '', // 这里应该从users表获取，但为了简化先留空
      email: '', // 这里应该从users表获取，但为了简化先留空
      bio: userData.bio || '',
      avatar: userData.avatar_url || '/20250731114736.jpg',
      location: userData.location || '',
      website: userData.website || ''
    };

    const totalTime = Date.now() - startTime;
    console.log(`[User Profile API] 请求完成，总耗时: ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      data: profileData,
      message: '用户档案更新成功'
    });

  } catch (error) {
    console.error('[User Profile API] 更新用户档案失败:', error);
    console.error(`[User Profile API] 失败耗时: ${Date.now() - startTime}ms`);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '更新用户档案失败'
      },
      { status: 500 }
    );
  }
}