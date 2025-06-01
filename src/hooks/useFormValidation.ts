
import { useState } from "react";
import { z } from "zod";

export const useFormValidation = <T extends z.ZodSchema>(schema: T) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: unknown): data is z.infer<T> => {
    try {
      schema.parse(data);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path.join(".")] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName];
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    validate,
    errors,
    getFieldError,
    clearErrors,
    hasErrors: Object.keys(errors).length > 0,
  };
};
