import { NextRequest } from 'next/server';
import { withDbClient } from '@/lib/database';
import {
  successResponse,
  badRequestResponse,
  notFoundResponse,
  errorResponse
} from '@/lib/api-response';
import { formatWorkData } from '@/types/work';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return badRequestResponse('作品ID参数缺失');
    }

    const work = await withDbClient(async (client) => {
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
          cw.updated_at,
          cw.creator_id,
          u.username as creator_username,
          u.username as creator_display_name,
          up.avatar_url as creator_avatar,
          up.avatar_data as creator_avatar_data,
          up.bio as creator_bio
        FROM creative_works cw
        LEFT JOIN users u ON cw.creator_id = u.id
        LEFT JOIN user_profiles up ON u.id = up.user_id
        WHERE cw.id = $1 AND cw.is_public = true
      `;

      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    });

    if (!work) {
      return notFoundResponse('作品不存在或未公开');
    }

    // 使用通用格式化函数
    const formattedWork = formatWorkData(work);

    return successResponse(formattedWork, '作品详情获取成功');
  } catch (error) {
    return errorResponse(error, '获取作品详情失败');
  }
}
