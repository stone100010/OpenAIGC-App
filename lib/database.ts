/**
 * 数据库连接工具库
 * 统一管理PostgreSQL数据库连接，减少重复代码
 */

import { Client } from 'pg';

// 数据库配置 - 针对 Neon Serverless 优化
const DB_CONFIG = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  connectionTimeoutMillis: 30000,
  query_timeout: 45000,
  statement_timeout: 45000,
  max: 20, // 最大连接数
  min: 5,  // 最小连接数
  idleTimeoutMillis: 30000,
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
};

/**
 * 获取数据库客户端实例
 */
export async function getDbClient(): Promise<Client> {
  const client = new Client(DB_CONFIG);
  await client.connect();
  return client;
}

/**
 * 安全关闭数据库连接
 */
export async function closeDbClient(client: Client | null): Promise<void> {
  if (client) {
    try {
      await client.end();
    } catch (error) {
      console.error('关闭数据库连接失败:', error);
    }
  }
}

/**
 * 带重试的数据库操作包装函数
 */
export async function withDbClient<T>(
  fn: (client: Client) => Promise<T>,
  maxRetries = 2
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let client: Client | null = null;
    try {
      client = await getDbClient();
      const result = await fn(client);
      return result;
    } catch (error) {
      lastError = error as Error;
      console.error(`数据库操作失败 (尝试 ${attempt + 1}/${maxRetries + 1}):`, error);

      // 如果是超时错误，等待后重试
      if (attempt < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    } finally {
      await closeDbClient(client);
    }
  }

  throw lastError;
}

/**
 * 执行事务操作的包装函数
 */
export async function withTransaction<T>(
  fn: (client: Client) => Promise<T>
): Promise<T> {
  const client = await getDbClient();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await closeDbClient(client);
  }
}

/**
 * 检查数据库连接是否正常
 */
export async function checkDbConnection(): Promise<boolean> {
  try {
    await withDbClient(async (client) => {
      await client.query('SELECT 1');
    });
    return true;
  } catch {
    return false;
  }
}
