import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import spec from '@/swagger/spec';

const options = {
  explorer: true,
  swaggerOptions: {
    docExpansion: 'full'
  }
};

const swaggerMiddleware = (app: Express) => {
  app.use('/swagger', swaggerUi.serveFiles(spec), swaggerUi.setup(spec, options));
};

export default swaggerMiddleware;
