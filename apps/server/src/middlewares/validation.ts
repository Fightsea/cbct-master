import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { ValidationError } from '@/utils/error';

type SchemaMap = { [key in RequestDataSource]?: AnyZodObject };

const validationMiddleware = (schemaMap: SchemaMap) => (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  try {
    Object.entries<AnyZodObject>(schemaMap).forEach(([type, schema]) => {
      const value = schema.parse(req[type as RequestDataSource]);
      req[type as RequestDataSource] = {
        ...req[type as RequestDataSource],
        ...value
      };
    });
  } catch (e: unknown) {
    if (e instanceof ZodError) {
      const msg = e.errors.map(issue => `${issue.path.length > 0 ? `${issue.path.join('.')} is ` : ''}${issue.message}`);
      throw new ValidationError('VALIDATION_ERROR', JSON.stringify(msg));
    }
  }

  next();
};

export default validationMiddleware;
