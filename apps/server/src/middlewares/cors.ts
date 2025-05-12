import cors from 'cors';
import { Express } from 'express';

const corsOptions: cors.CorsOptions = {
  origin: process.env.CLIENT_ORIGIN,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  credentials: true
};

const corsMiddleware = (app: Express) => {
  app.use(cors(corsOptions));
};

export default corsMiddleware;
