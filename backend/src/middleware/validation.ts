import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validateRequest = (schema: ZodSchema, location: 'body' | 'params' | 'query') => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req[location];
      await schema.parseAsync(data);
      next();
    } catch (error: any) {
      const errors = error.errors?.map((err: any) => ({
        field: err.path?.join('.') || 'unknown',
        message: err.message
      })) || [{ field: 'validation', message: 'Validation failed' }];
      
      res.status(400).json({
        success: false,
        error: 'Validation error',
        details: errors
      });
    }
  };
};

// Combine multiple validation middlewares
export const validateMultiple = (...validations: ReturnType<typeof validateRequest>[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    let index = 0;
    
    const runNext = (error?: any) => {
      if (error) return next(error);
      
      if (index >= validations.length) return next();
      
      const validation = validations[index++];
      validation(req, res, runNext);
    };
    
    runNext();
  };
};
