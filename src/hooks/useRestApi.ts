import { useState, useCallback } from 'react';
import axiosInstance from '@/lib/axios';
import { AxiosRequestConfig } from 'axios';

export function useRestApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(async <T>(
    method: 'get' | 'post' | 'put' | 'patch' | 'delete',
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance[method](url,
        method === 'get' ? config : data,
        method !== 'get' ? config : undefined
      );
      return response.data;
    } catch (err) {
      const error = err as Error;
      setError(error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    get: <T>(url: string, config?: AxiosRequestConfig) =>
      request<T>('get', url, undefined, config),
    post: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>('post', url, data, config),
    put: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>('put', url, data, config),
    patch: <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
      request<T>('patch', url, data, config),
    delete: <T>(url: string, config?: AxiosRequestConfig) =>
      request<T>('delete', url, undefined, config),
  };
}