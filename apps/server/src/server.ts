import express, { Express } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import compression from 'compression';
import { isDev } from '@cbct/utils/system';
import router from '@/routers';
import corsMiddleware from '@/middlewares/cors';
import errorHandlerMiddleware from '@/middlewares/errorHandler';
import swaggerMiddleware from '@/middlewares/swagger';
import loggerMiddleware from '@/middlewares/logger';
import { jwtAuthMiddleware } from '@/middlewares/jwtAuth';
import redisMiddleware from '@/middlewares/redis';

// Remove AWS notice in console
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('aws-sdk/lib/maintenance_mode_message').suppress = true;

dotenv.config();
const app: Express = express();

app.use(helmet());
app.use(compression());

if (isDev) {
  swaggerMiddleware(app);
}

corsMiddleware(app);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

app.use(redisMiddleware);

app.use(loggerMiddleware);

app.use(jwtAuthMiddleware);

app.use('/api', router);

app.use(errorHandlerMiddleware);

const port = process.env.SERVER_PORT;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
