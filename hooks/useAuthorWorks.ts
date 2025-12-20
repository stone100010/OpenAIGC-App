'use client';

/**
 * 作者作品获取Hook
 * 用于获取特定作者的最近作品
 */

import { useState, useEffect, useCallback } from 'react';

interface AuthorWork {
  id: string;
  title: string;
  thumbnailUrl: string;
  mediaUrl: string;
  contentType: string;
  createdAt: string;
  likesCount?: number;
  viewsCount?: number;
}

interface UseAuthorWorksResult {
  works: AuthorWork[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useAuthorWorks(authorId: string | null): UseAuthorWorksResult {
  const [works, setWorks] = useState<AuthorWork[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorks = useCallback(async () => {
    if (!authorId) {
      setWorks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 使用fetch调用creative-works API获取作者作品
      const response = await fetch(`/api/creative-works?author_id=${authorId}&limit=4&sort=created_at.desc`);
      
      if (!response.ok) {
        throw new Error('获取作者作品失败');
      }

      const result = await response.json();

      if (result.success && result.data) {
        // API返回的数据格式是 { works: [...] }
        const worksList = result.data.works || result.data;
        const formattedWorks = worksList.map((work: any) => ({
          id: work.id,
          title: work.title,
          thumbnailUrl: work.thumbnail_url || work.media_url,
          mediaUrl: work.media_url,
          contentType: work.content_type,
          createdAt: work.created_at,
          likesCount: work.likes_count || 0,
          viewsCount: work.views_count || 0
        }));
        setWorks(formattedWorks);
      } else {
        setWorks([]);
      }
    } catch (err) {
      console.error('获取作者作品失败:', err);
      setError(err instanceof Error ? err.message : '获取作者作品失败');
      setWorks([]);
    } finally {
      setLoading(false);
    }
  }, [authorId]);

  useEffect(() => {
    fetchWorks();
  }, [fetchWorks]);

  return { works, loading, error, refetch: fetchWorks };
}

export default useAuthorWorks;