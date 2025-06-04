
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface QueryOptions {
  enabled?: boolean;
  refetchInterval?: number;
  cacheTime?: number;
}

export const useOptimizedQuery = <T>(
  queryKey: string,
  queryFn: () => Promise<T>,
  options: QueryOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const cache = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const { enabled = true, refetchInterval, cacheTime = 5 * 60 * 1000 } = options;

  const executeQuery = async () => {
    try {
      setLoading(true);
      setError(null);

      // Проверяем кэш
      const cached = cache.current.get(queryKey);
      if (cached && Date.now() - cached.timestamp < cacheTime) {
        setData(cached.data);
        setLoading(false);
        return;
      }

      const result = await queryFn();
      
      // Сохраняем в кэш
      cache.current.set(queryKey, {
        data: result,
        timestamp: Date.now()
      });

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Query failed'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!enabled) return;

    executeQuery();

    if (refetchInterval) {
      const interval = setInterval(executeQuery, refetchInterval);
      return () => clearInterval(interval);
    }
  }, [queryKey, enabled, refetchInterval]);

  const refetch = () => {
    cache.current.delete(queryKey);
    executeQuery();
  };

  const invalidateCache = () => {
    cache.current.clear();
  };

  return {
    data,
    loading,
    error,
    refetch,
    invalidateCache
  };
};
