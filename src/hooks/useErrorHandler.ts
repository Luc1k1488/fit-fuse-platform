
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface ErrorState {
  error: Error | null;
  isError: boolean;
}

export const useErrorHandler = () => {
  const [errorState, setErrorState] = useState<ErrorState>({
    error: null,
    isError: false
  });

  const handleError = useCallback((error: Error | string, showToast: boolean = true) => {
    const errorObj = typeof error === 'string' ? new Error(error) : error;
    
    console.error('Error handled:', errorObj);
    
    setErrorState({
      error: errorObj,
      isError: true
    });

    if (showToast) {
      toast.error(errorObj.message || 'Произошла неизвестная ошибка');
    }
  }, []);

  const clearError = useCallback(() => {
    setErrorState({
      error: null,
      isError: false
    });
  }, []);

  const withErrorHandling = useCallback(
    <T extends any[], R>(
      fn: (...args: T) => Promise<R>,
      errorMessage?: string
    ) => {
      return async (...args: T): Promise<R | null> => {
        try {
          clearError();
          return await fn(...args);
        } catch (error) {
          const message = errorMessage || (error as Error).message;
          handleError(new Error(message));
          return null;
        }
      };
    },
    [handleError, clearError]
  );

  return {
    error: errorState.error,
    isError: errorState.isError,
    handleError,
    clearError,
    withErrorHandling
  };
};
