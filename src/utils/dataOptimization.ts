
// Data optimization utilities for large datasets
export class DataOptimizer {
  private cache = new Map<string, any>();
  private readonly maxCacheSize: number;

  constructor(maxCacheSize = 1000) {
    this.maxCacheSize = maxCacheSize;
  }

  // LRU Cache implementation
  get(key: string) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return null;
  }

  set(key: string, value: any) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxCacheSize) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }

  clear() {
    this.cache.clear();
  }

  // Chunked data processing
  static async processInChunks<T, R>(
    data: T[],
    processor: (chunk: T[]) => Promise<R[]>,
    chunkSize = 100
  ): Promise<R[]> {
    const results: R[] = [];
    
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      const chunkResults = await processor(chunk);
      results.push(...chunkResults);
      
      // Yield control to prevent blocking
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    return results;
  }

  // Optimized search with indexing
  static createSearchIndex<T>(
    data: T[],
    fields: (keyof T)[]
  ): Map<string, Set<number>> {
    const index = new Map<string, Set<number>>();
    
    data.forEach((item, itemIndex) => {
      fields.forEach(field => {
        const value = item[field];
        if (value != null) {
          const words = value.toString().toLowerCase().split(/\s+/);
          words.forEach(word => {
            if (!index.has(word)) {
              index.set(word, new Set());
            }
            index.get(word)!.add(itemIndex);
          });
        }
      });
    });
    
    return index;
  }

  static searchWithIndex<T>(
    data: T[],
    index: Map<string, Set<number>>,
    query: string
  ): T[] {
    if (!query.trim()) return data;
    
    const queryWords = query.toLowerCase().split(/\s+/);
    let resultIndices: Set<number> | null = null;
    
    queryWords.forEach(word => {
      const wordIndices = index.get(word) || new Set();
      
      if (resultIndices === null) {
        resultIndices = new Set(wordIndices);
      } else {
        resultIndices = new Set([...resultIndices].filter(x => wordIndices.has(x)));
      }
    });
    
    return resultIndices ? [...resultIndices].map(i => data[i]) : [];
  }

  // Pagination optimization
  static paginateData<T>(
    data: T[],
    page: number,
    limit: number
  ): {
    items: T[];
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  } {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const items = data.slice(startIndex, endIndex);
    const totalPages = Math.ceil(data.length / limit);
    
    return {
      items,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
  }

  // Memory-efficient sorting
  static sortLargeDataset<T>(
    data: T[],
    compareFn: (a: T, b: T) => number,
    chunkSize = 10000
  ): T[] {
    if (data.length <= chunkSize) {
      return [...data].sort(compareFn);
    }
    
    // For very large datasets, implement merge sort
    const chunks: T[][] = [];
    for (let i = 0; i < data.length; i += chunkSize) {
      const chunk = data.slice(i, i + chunkSize);
      chunks.push(chunk.sort(compareFn));
    }
    
    return this.mergeChunks(chunks, compareFn);
  }

  private static mergeChunks<T>(
    chunks: T[][],
    compareFn: (a: T, b: T) => number
  ): T[] {
    while (chunks.length > 1) {
      const newChunks: T[][] = [];
      
      for (let i = 0; i < chunks.length; i += 2) {
        if (i + 1 < chunks.length) {
          newChunks.push(this.mergeTwoArrays(chunks[i], chunks[i + 1], compareFn));
        } else {
          newChunks.push(chunks[i]);
        }
      }
      
      chunks = newChunks;
    }
    
    return chunks[0] || [];
  }

  private static mergeTwoArrays<T>(
    arr1: T[],
    arr2: T[],
    compareFn: (a: T, b: T) => number
  ): T[] {
    const result: T[] = [];
    let i = 0, j = 0;
    
    while (i < arr1.length && j < arr2.length) {
      if (compareFn(arr1[i], arr2[j]) <= 0) {
        result.push(arr1[i++]);
      } else {
        result.push(arr2[j++]);
      }
    }
    
    while (i < arr1.length) result.push(arr1[i++]);
    while (j < arr2.length) result.push(arr2[j++]);
    
    return result;
  }

  // Data deduplication
  static deduplicateData<T>(
    data: T[],
    keyExtractor: (item: T) => string | number
  ): T[] {
    const seen = new Set<string | number>();
    return data.filter(item => {
      const key = keyExtractor(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

// Global data optimizer instance
export const dataOptimizer = new DataOptimizer();
