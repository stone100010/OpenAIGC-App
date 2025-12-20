'use client';

/**
 * 作品数据获取Hook
 * 用于详情页面获取作品数据
 */

import { useState, useEffect, useCallback } from 'react';
import type { WorkData } from '@/types/work';

interface UseWorkDataResult {
  data: WorkData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useWorkData(workId: string | null): UseWorkDataResult {
  const [data, setData] = useState<WorkData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!workId) {
      setLoading(false);
      setError('作品ID无效');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/creative-works-single?id=${workId}`);
      const result = await response.json();

      if (result.success && result.data) {
        // 转换API响应格式为WorkData
        const work = result.data;
        setData({
          id: work.id,
          title: work.title,
          description: work.description || '',
          contentType: work.content_type || work.contentType,
          mediaUrl: work.media_url || work.mediaUrl,
          thumbnailUrl: work.thumbnail_url || work.thumbnailUrl || work.media_url || work.mediaUrl,
          prompt: work.prompt,
          parameters: work.parameters,
          tags: work.tags || [],
          viewsCount: work.views_count ?? work.viewsCount ?? 0,
          likesCount: work.likes_count ?? work.likesCount ?? 0,
          isPublic: work.is_public ?? work.isPublic ?? true,
          isFeatured: work.is_featured ?? work.isFeatured ?? false,
          duration: work.duration,
          fileSize: work.file_size || work.fileSize,
          createdAt: work.created_at || work.createdAt,
          updatedAt: work.updated_at || work.updatedAt,
          creator: {
            id: work.creator?.id || work.creator_id,
            username: work.creator?.username || work.creator_username || 'unknown',
            displayName: work.creator?.display_name || work.creator?.displayName || work.creator_display_name || '未知用户',
            avatarUrl: work.creator?.avatar_url || work.creator?.avatarUrl || work.creator_avatar || '/20250731114736.jpg',
            bio: work.creator?.bio
          },
          contentData: work.content_data || work.contentData
        });
      } else {
        setError(result.message || '获取作品失败');
      }
    } catch (err) {
      console.error('获取作品数据失败:', err);
      setError(err instanceof Error ? err.message : '获取作品失败');
    } finally {
      setLoading(false);
    }
  }, [workId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

export default useWorkData;
