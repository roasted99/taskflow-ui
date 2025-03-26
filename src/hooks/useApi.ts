import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T | null>;
}

export const useApi = <T>(
  apiFunction: (...args: any[]) => Promise<T>
): ApiResponse<T> => {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await apiFunction(...args);
        setData(result);
        return result;
      } catch (err: any) {
        const errorMessage = err.response?.data?.message || 'An error occurred';
        setError(errorMessage);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [apiFunction]
  );

  return { data, isLoading, error, execute };
};