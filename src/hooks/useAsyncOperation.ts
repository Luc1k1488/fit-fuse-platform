
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAsyncOperationProps<T> {
  operation: () => Promise<T>;
  onSuccess?: (result: T) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export const useAsyncOperation = <T>() => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(async (props: UseAsyncOperationProps<T>) => {
    const { operation, onSuccess, onError, successMessage, errorMessage } = props;
    
    setLoading(true);
    setError(null);

    try {
      const result = await operation();
      
      if (successMessage) {
        toast.success(successMessage);
      }
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Неизвестная ошибка');
      setError(error);
      
      console.error('Async operation error:', error);
      
      if (errorMessage) {
        toast.error(errorMessage);
      } else {
        toast.error(error.message);
      }
      
      if (onError) {
        onError(error);
      }
      
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, execute };
};
