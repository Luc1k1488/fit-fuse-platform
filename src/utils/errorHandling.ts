
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const handleError = (error: unknown): Error => {
  if (error instanceof Error) {
    return error;
  }
  
  if (typeof error === 'string') {
    return new Error(error);
  }
  
  if (typeof error === 'object' && error !== null) {
    if ('message' in error && typeof error.message === 'string') {
      return new Error(error.message);
    }
  }
  
  return new Error('Произошла неизвестная ошибка');
};

export const isNetworkError = (error: Error): boolean => {
  return error.name === 'NetworkError' || 
         error.message.includes('fetch') ||
         error.message.includes('network');
};

export const isValidationError = (error: Error): boolean => {
  return error.name === 'ValidationError';
};
