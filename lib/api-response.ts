/**
 * API响应工具库
 * 统一API响应格式，减少重复代码
 */

import { NextResponse } from 'next/server';

// 通用API响应接口
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message: string;
  timestamp?: number;
}

/**
 * 成功响应
 */
export function successResponse<T>(
  data: T,
  message = '操作成功',
  status = 200
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
      timestamp: Date.now()
    },
    { status }
  );
}

/**
 * 创建成功响应 (201)
 */
export function createdResponse<T>(
  data: T,
  message = '创建成功'
): NextResponse<ApiResponse<T>> {
  return successResponse(data, message, 201);
}

/**
 * 错误响应
 */
export function errorResponse(
  error: unknown,
  message: string,
  status = 500
): NextResponse<ApiResponse<never>> {
  const errorMessage = error instanceof Error ? error.message : '未知错误';

  // 仅在开发环境打印详细错误
  if (process.env.NODE_ENV === 'development') {
    console.error(`[API Error] ${message}:`, error);
  } else {
    console.error(`[API Error] ${message}: ${errorMessage}`);
  }

  return NextResponse.json(
    {
      success: false,
      error: errorMessage,
      message,
      timestamp: Date.now()
    },
    { status }
  );
}

/**
 * 参数错误响应 (400)
 */
export function badRequestResponse(
  message: string,
  details?: string
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: details || message,
      message,
      timestamp: Date.now()
    },
    { status: 400 }
  );
}

/**
 * 未授权响应 (401)
 */
export function unauthorizedResponse(
  message = '未授权访问'
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: 'Unauthorized',
      message,
      timestamp: Date.now()
    },
    { status: 401 }
  );
}

/**
 * 资源不存在响应 (404)
 */
export function notFoundResponse(
  message = '资源不存在'
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: 'Not Found',
      message,
      timestamp: Date.now()
    },
    { status: 404 }
  );
}

/**
 * 配额超限响应 (429)
 */
export function quotaExceededResponse(
  used: number,
  limit: number,
  resetAt?: Date
): NextResponse<ApiResponse<{ quota: { used: number; limit: number; resetAt?: string } }>> {
  return NextResponse.json(
    {
      success: false,
      error: 'Quota Exceeded',
      message: '配额已用尽',
      data: {
        quota: {
          used,
          limit,
          resetAt: resetAt?.toISOString()
        }
      },
      timestamp: Date.now()
    },
    { status: 429 }
  );
}
