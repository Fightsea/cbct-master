import { Request } from 'express';
import morgan from 'morgan';
import json from 'morgan-json';
import { logger } from '@/utils/logger';
import { getNowDatetime } from '@cbct/utils/moment';

morgan.token<Request>('user', req => JSON.stringify(req.user || 'NONE'));

morgan.token<Request>('headers', req => JSON.stringify(req.headers));

morgan.token<Request>('query', req => JSON.stringify(req.query));

morgan.token<Request>('body', req => {
  delete req.body.password;
  delete req.body.segmentation_results;

  return JSON.stringify(req.body);
});

morgan.token('timestamp', () => getNowDatetime());

const jsonFormat = json({
  time: ':timestamp',
  url: ':url',
  method: ':method',
  status: ':status',
  user: ':user',
  headers: ':headers',
  query: ':query',
  body: ':body',
  responseTime: ':response-time ms'
});

const loggerMiddleware = morgan(jsonFormat, { stream: { write: message => logger.info(JSON.parse(message)) } });

export default loggerMiddleware;
