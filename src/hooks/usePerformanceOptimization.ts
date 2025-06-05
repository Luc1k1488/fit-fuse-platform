import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { debounce, throttle } from 'lodash';

interface PerformanceConfig {
  enableVirtualization?: boolean;
  lazyLoadThreshold?: number;
  cacheSize?: number;
  debounceDelay?: number;
  throttleDelay?: number;
}

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  loadTime: number;
  itemsRendered: number;
}

export const usePerformanceOptimization = (config: PerformanceConfig = {}) => {
  const {
    enableVirtualization = true,
    lazyLoadThreshold = 100,
    cacheSize = 1000,
    debounceDelay = 300,
    throttleDelay = 100,
  } = config;

  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    loadTime: 0,
    itemsRendered: 0,
  });

  const cache = useRef(new Map());
  const observer = useRef<IntersectionObserver | null>(null);

  const measureRenderTime = useCallback((fn: () => void) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    
    setMetrics(prev => ({
      ...prev,
      renderTime: end - start,
    }));
  }, []);

  const trackMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      setMetrics(prev => ({
        ...prev,
        memoryUsage: memory.usedJSHeapSize,
      }));
    }
  }, []);

  const cacheGet = useCallback((key: string) => {
    return cache.current.get(key);
  }, []);

  const cacheSet = useCallback((key: string, value: any) => {
    if (cache.current.size >= cacheSize) {
      const firstKey = cache.current.keys().next().value;
      cache.current.delete(firstKey);
    }
    cache.current.set(key, value);
  }, [cacheSize]);

  const cacheClear = useCallback(() => {
    cache.current.clear();
  }, []);

  const getVisibleItems = useCallback((
    items: any[],
    startIndex: number,
    endIndex: number
  ) => {
    if (!enableVirtualization) return items;
    
    return items.slice(startIndex, endIndex + 1);
  }, [enableVirtualization]);

  const setupLazyLoading = useCallback((
    callback: (entries: IntersectionObserverEntry[]) => void,
    options?: IntersectionObserverInit
  ) => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(callback, {
      rootMargin: '50px',
      threshold: 0.1,
      ...options,
    });

    return observer.current;
  }, []);

  const createDebouncedFunction = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    delay?: number
  ) => {
    return debounce(fn, delay || debounceDelay);
  }, [debounceDelay]);

  const createThrottledFunction = useCallback(<T extends (...args: any[]) => any>(
    fn: T,
    delay?: number
  ) => {
    return throttle(fn, delay || throttleDelay);
  }, [throttleDelay]);

  const createMemoizedSearch = useCallback((
    items: any[],
    searchFields: string[]
  ) => {
    return useMemo(() => {
      return (query: string) => {
        if (!query.trim()) return items;
        
        const cacheKey = `search_${query}`;
        const cached = cacheGet(cacheKey);
        if (cached) return cached;

        const lowercaseQuery = query.toLowerCase();
        const filtered = items.filter(item =>
          searchFields.some(field => {
            const value = item[field];
            return value && value.toString().toLowerCase().includes(lowercaseQuery);
          })
        );

        cacheSet(cacheKey, filtered);
        return filtered;
      };
    }, [items, searchFields]);
  }, [cacheGet, cacheSet]);

  const processBatch = useCallback(async <T, R>(
    items: T[],
    processor: (item: T) => Promise<R>,
    batchSize = 50
  ): Promise<R[]> => {
    const results: R[] = [];
    
    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch.map(processor));
      results.push(...batchResults);
      
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return results;
  }, []);

  useEffect(() => {
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(trackMemoryUsage, 5000);
    return () => clearInterval(interval);
  }, [trackMemoryUsage]);

  return {
    metrics,
    measureRenderTime,
    trackMemoryUsage,
    cacheGet,
    cacheSet,
    cacheClear,
    getVisibleItems,
    setupLazyLoading,
    createDebouncedFunction,
    createThrottledFunction,
    createMemoizedSearch,
    processBatch,
  };
};

// HOC for performance monitoring - Fixed type issues
export const withPerformanceMonitoring = <P extends Record<string, any>>(
  Component: React.ComponentType<P>,
  componentName: string
) => {
  const WrappedComponent: React.FC<P> = (props: P) => {
    const { measureRenderTime } = usePerformanceOptimization();
    
    useEffect(() => {
      console.log(`${componentName} mounted`);
      return () => console.log(`${componentName} unmounted`);
    }, []);

    return React.createElement(Component, props);
  };

  WrappedComponent.displayName = `withPerformanceMonitoring(${componentName})`;
  
  return WrappedComponent;
};
