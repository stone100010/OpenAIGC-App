'use client';

/**
 * 生成器状态管理Hook
 * 用于图像/音频/视频生成工具
 */

import { useState, useCallback } from 'react';

export interface GeneratorState<T = string> {
  prompt: string;
  isGenerating: boolean;
  result: T | null;
  error: string | null;
  progress: string;
}

export interface GeneratorActions<T = string> {
  setPrompt: (prompt: string) => void;
  startGeneration: () => void;
  setResult: (result: T | null) => void;
  setError: (error: string | null) => void;
  setProgress: (progress: string) => void;
  reset: () => void;
}

export interface UseGeneratorResult<T = string> extends GeneratorState<T>, GeneratorActions<T> {}

export function useGenerator<T = string>(
  initialPrompt = ''
): UseGeneratorResult<T> {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResultState] = useState<T | null>(null);
  const [error, setErrorState] = useState<string | null>(null);
  const [progress, setProgressState] = useState('');

  const startGeneration = useCallback(() => {
    setIsGenerating(true);
    setErrorState(null);
    setProgressState('准备中...');
  }, []);

  const setResult = useCallback((newResult: T | null) => {
    setResultState(newResult);
    setIsGenerating(false);
    setProgressState('');
  }, []);

  const setError = useCallback((newError: string | null) => {
    setErrorState(newError);
    setIsGenerating(false);
    setProgressState('');
  }, []);

  const setProgress = useCallback((newProgress: string) => {
    setProgressState(newProgress);
  }, []);

  const reset = useCallback(() => {
    setPrompt('');
    setIsGenerating(false);
    setResultState(null);
    setErrorState(null);
    setProgressState('');
  }, []);

  return {
    prompt,
    isGenerating,
    result,
    error,
    progress,
    setPrompt,
    startGeneration,
    setResult,
    setError,
    setProgress,
    reset
  };
}

/**
 * 生成参数管理Hook
 */
export interface GeneratorParams {
  style: string;
  quality: string;
  size: string;
  [key: string]: string;
}

export function useGeneratorParams(
  initialParams: GeneratorParams = { style: 'realistic', quality: 'high', size: '1:1' }
) {
  const [params, setParams] = useState<GeneratorParams>(initialParams);

  const setParam = useCallback((key: string, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
  }, []);

  const resetParams = useCallback(() => {
    setParams(initialParams);
  }, [initialParams]);

  return { params, setParam, resetParams };
}

export default useGenerator;
