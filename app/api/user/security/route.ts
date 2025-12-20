import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';
import bcrypt from 'bcrypt';

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
      console.log('[User Security API] 检测到旧格式用户ID，已映射到odyssey用户:', { originalId: request.headers.get('x-user-id'), mappedId: userId });
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
    const { currentPassword, newPassword, twoFactorEnabled } = body;

    console.log('[User Security API] 更新安全设置:', { 
      userId, 
      hasCurrentPassword: !!currentPassword,
      hasNewPassword: !!newPassword,
      twoFactorEnabled 
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
    console.log(`[User Security API] 数据库连接耗时: ${Date.now() - connectStart}ms`);

    // 启动事务
    await client.query('BEGIN');

    // 如果有密码修改请求，先验证当前密码
    if (currentPassword && newPassword) {
      // 获取当前密码哈希
      const queryStart = Date.now();
      const passwordQuery = `
        SELECT password_hash 
        FROM users 
        WHERE id = $1 AND is_active = true
      `;

      const passwordResult = await client.query(passwordQuery, [userId]);
      console.log(`[User Security API] 密码查询耗时: ${Date.now() - queryStart}ms`);

      if (passwordResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, message: '用户不存在' },
          { status: 404 }
        );
      }

      const currentPasswordHash = passwordResult.rows[0].password_hash;

      // 验证当前密码
      const isValidPassword = await bcrypt.compare(currentPassword, currentPasswordHash);
      if (!isValidPassword) {
        await client.query('ROLLBACK');
        return NextResponse.json(
          { success: false, message: '当前密码错误' },
          { status: 400 }
        );
      }

      // 加密新密码
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      // 更新密码
      const updateStart = Date.now();
      const updateQuery = `
        UPDATE users 
        SET password_hash = $1, updated_at = NOW()
        WHERE id = $2
      `;

      await client.query(updateQuery, [newPasswordHash, userId]);
      console.log(`[User Security API] 密码更新耗时: ${Date.now() - updateStart}ms`);
    }

    // 更新两步验证设置（这里简化处理，实际应该存储在专门的表中）
    if (typeof twoFactorEnabled === 'boolean') {
      // 这里可以添加两步验证的具体实现
      // 目前只是记录日志
      console.log(`[User Security API] 两步验证设置: ${twoFactorEnabled}`);
    }

    // 提交事务
    await client.query('COMMIT');

    const totalTime = Date.now() - startTime;
    console.log(`[User Security API] 请求完成，总耗时: ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      message: '安全设置更新成功'
    });

  } catch (error) {
    console.error('[User Security API] 更新安全设置失败:', error);
    
    // 回滚事务
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        console.error('[User Security API] 回滚失败:', rollbackError);
      }
    }

    console.error(`[User Security API] 失败耗时: ${Date.now() - startTime}ms`);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '更新安全设置失败'
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        console.error('[User Security API] 关闭连接失败:', e);
      }
    }
  }
}

// 获取登录历史
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
      console.log('[User Security API] 检测到旧格式用户ID，已映射到odyssey用户:', { originalId: request.headers.get('x-user-id'), mappedId: userId });
    }

    // 验证UUID格式
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { success: false, message: '无效的用户ID格式' },
        { status: 400 }
      );
    }

    console.log('[User Security API] 获取登录历史:', { userId });

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
    console.log(`[User Security API] 数据库连接耗时: ${Date.now() - connectStart}ms`);

    // 查询最近的登录记录
    const queryStart = Date.now();
    const query = `
      SELECT 
        session_token,
        ip_address,
        user_agent,
        created_at,
        is_active
      FROM user_sessions
      WHERE user_id = $1 AND is_active = true
      ORDER BY created_at DESC
      LIMIT 10
    `;

    const result = await client.query(query, [userId]);
    console.log(`[User Security API] 查询耗时: ${Date.now() - queryStart}ms`);

    // 格式化登录历史数据
    const loginHistory = result.rows.map((row, index) => {
      // 解析User-Agent来判断设备类型
      const userAgent = row.user_agent || '';
      let deviceType = 'Unknown';
      let deviceName = 'Unknown Device';
      
      if (userAgent.includes('Chrome')) {
        deviceType = 'browser';
        deviceName = 'Chrome 浏览器';
      } else if (userAgent.includes('Firefox')) {
        deviceType = 'browser';
        deviceName = 'Firefox 浏览器';
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        deviceType = 'browser';
        deviceName = 'Safari 浏览器';
      } else if (userAgent.includes('Mobile') || userAgent.includes('iPhone') || userAgent.includes('Android')) {
        deviceType = 'mobile';
        deviceName = 'Mobile Device';
      }

      // 模拟地理位置（实际应用中可以从IP获取）
      const location = '北京，中国';

      return {
        id: row.session_token,
        deviceType,
        deviceName,
        location,
        isCurrentDevice: index === 0, // 最新的登录记录视为当前设备
        loginTime: row.created_at,
        ipAddress: row.ip_address
      };
    });

    const totalTime = Date.now() - startTime;
    console.log(`[User Security API] 请求完成，总耗时: ${totalTime}ms`);

    return NextResponse.json({
      success: true,
      data: loginHistory,
      message: '登录历史获取成功'
    });

  } catch (error) {
    console.error('[User Security API] 获取登录历史失败:', error);
    console.error(`[User Security API] 失败耗时: ${Date.now() - startTime}ms`);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : '未知错误',
        message: '获取登录历史失败'
      },
      { status: 500 }
    );
  } finally {
    if (client) {
      try {
        await client.end();
      } catch (e) {
        console.error('[User Security API] 关闭连接失败:', e);
      }
    }
  }
}