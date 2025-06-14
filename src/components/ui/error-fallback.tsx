
import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';

interface ErrorFallbackProps {
  error: Error;
  resetError: () => void;
  title?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({ 
  error, 
  resetError, 
  title = "Что-то пошло не так" 
}) => {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <CardTitle className="text-red-600">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-2">Детали ошибки:</p>
          <p className="font-mono text-xs">{error.message}</p>
        </div>
        <Button 
          onClick={resetError} 
          className="w-full"
          variant="outline"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Попробовать снова
        </Button>
      </CardContent>
    </Card>
  );
};
