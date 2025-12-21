/**
 * 作品相关类型定义
 */

// 内容类型
export type ContentType = 'image' | 'audio' | 'video' | 'text';

// 创作者信息
export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  avatarData?: string;
  bio?: string;
}

// 作品数据
export interface WorkData {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  mediaUrl: string;
  thumbnailUrl: string;
  prompt?: string;
  parameters?: Record<string, unknown>;
  tags: string[];
  viewsCount: number;
  likesCount: number;
  isPublic: boolean;
  isFeatured: boolean;
  duration?: number;
  fileSize?: number;
  createdAt: string;
  updatedAt: string;
  creator: Creator;
  contentData?: Record<string, unknown>; // 存储内容数据，如文本内容等
}

// 作品列表项 (简化版)
export interface WorkListItem {
  id: string;
  title: string;
  description: string;
  contentType: ContentType;
  thumbnailUrl: string;
  mediaUrl?: string;
  viewsCount: number;
  likesCount: number;
  createdAt: string;
  tags?: string[];
  duration?: number;
  creator: {
    username: string;
    displayName: string;
    avatarUrl: string;
  };
}

// 作品筛选参数
export interface WorkFilterParams {
  type?: ContentType | 'all';
  featured?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
  creatorId?: string;
}

// 内容类型配置
export const CONTENT_TYPE_CONFIG: Record<ContentType, {
  label: string;
  icon: string;
  color: string;
  bgColor: string;
}> = {
  image: {
    label: '图像',
    icon: 'fa-image',
    color: '#3B82F6',
    bgColor: '#EFF6FF'
  },
  audio: {
    label: '音频',
    icon: 'fa-music',
    color: '#10B981',
    bgColor: '#ECFDF5'
  },
  video: {
    label: '视频',
    icon: 'fa-video',
    color: '#EF4444',
    bgColor: '#FEF2F2'
  },
  text: {
    label: '文本',
    icon: 'fa-file-alt',
    color: '#8B5CF6',
    bgColor: '#F5F3FF'
  }
};

/**
 * 格式化数据库行到WorkData
 */
export function formatWorkData(row: Record<string, unknown>): WorkData {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || '',
    contentType: row.content_type as ContentType,
    mediaUrl: row.media_url as string,
    thumbnailUrl: (row.thumbnail_url as string) || (row.media_url as string),
    prompt: undefined, // 数据库中不存在prompt字段
    parameters: row.parameters as Record<string, unknown> | undefined,
    tags: (row.tags as string[]) || [],
    viewsCount: (row.views_count as number) || 0,
    likesCount: (row.likes_count as number) || 0,
    isPublic: (row.is_public as boolean) ?? true,
    isFeatured: (row.is_featured as boolean) ?? false,
    duration: row.duration as number | undefined,
    fileSize: row.file_size as number | undefined,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
    creator: {
      id: row.creator_id as string,
      username: (row.creator_username as string) || 'unknown',
      displayName: (row.creator_display_name as string) || (row.creator_username as string) || '未知用户',
      avatarUrl: (row.creator_avatar as string) || '/20250731114736.jpg',
      avatarData: row.creator_avatar_data as string | undefined,
      bio: row.creator_bio as string | undefined
    },
    contentData: row.content_data as Record<string, unknown> | undefined
  };
}

/**
 * 格式化数据库行到WorkListItem
 */
export function formatWorkListItem(row: Record<string, unknown>): WorkListItem {
  return {
    id: row.id as string,
    title: row.title as string,
    description: (row.description as string) || '',
    contentType: row.content_type as ContentType,
    thumbnailUrl: (row.thumbnail_url as string) || (row.media_url as string),
    mediaUrl: row.media_url as string | undefined,
    viewsCount: (row.views_count as number) || 0,
    likesCount: (row.likes_count as number) || 0,
    createdAt: row.created_at as string,
    tags: (row.tags as string[]) || [],
    duration: row.duration as number | undefined,
    creator: {
      username: (row.creator_username as string) || 'unknown',
      displayName: (row.creator_display_name as string) || '未知用户',
      avatarUrl: (row.creator_avatar as string) || '/20250731114736.jpg',
      avatarData: row.creator_avatar_data as string | undefined
    }
  };
}
