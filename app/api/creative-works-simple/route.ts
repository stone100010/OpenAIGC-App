import { NextRequest } from 'next/server';
import { withDbClient } from '@/lib/database';
import { successResponse, errorResponse } from '@/lib/api-response';
import { formatWorkListItem, type ContentType } from '@/types/work';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as ContentType | null;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    const result = await withDbClient(async (client) => {
      let query = `
        SELECT
          cw.id, cw.title, cw.description, cw.content_type,
          cw.media_url, cw.thumbnail_url, cw.tags, cw.duration,
          cw.views_count, cw.likes_count, cw.created_at,
          u.username as creator_username,
          u.username as creator_display_name,
          NULL as creator_avatar,
          COUNT(*) OVER() as total_count
        FROM creative_works cw
        LEFT JOIN users u ON cw.creator_id = u.id
        WHERE cw.is_public = true
      `;

      const queryParams: (string | number)[] = [];
      let paramIndex = 1;

      if (type && ['image', 'video', 'text', 'audio'].includes(type)) {
        query += ` AND cw.content_type = $${paramIndex}`;
        queryParams.push(type);
        paramIndex++;
      }

      query += ` ORDER BY cw.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limit, offset);

      return await client.query(query, queryParams);
    });

    const totalCount = result.rows.length > 0 ? parseInt(result.rows[0].total_count) : 0;
    const formattedWorks = result.rows.map(formatWorkListItem);

    // 统计各类型数量
    const stats = {
      total: totalCount,
      image: formattedWorks.filter(w => w.contentType === 'image').length,
      video: formattedWorks.filter(w => w.contentType === 'video').length,
      text: formattedWorks.filter(w => w.contentType === 'text').length,
      audio: formattedWorks.filter(w => w.contentType === 'audio').length
    };

    return successResponse({
      works: formattedWorks,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      stats
    }, '创作作品获取成功');
  } catch (error) {
    return errorResponse(error, '获取创作作品失败');
  }
}
