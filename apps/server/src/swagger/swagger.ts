import schemas from './schemas';

export default {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'CBCT API',
      version: '0.0.1'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        },
        basicAuth: {
          type: 'http',
          scheme: 'basic',
          in: 'header'
        }
      },
      parameters: {
        id: {
          name: 'id',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        },
        search: {
          name: 'search',
          in: 'query',
          required: false,
          schema: { type: 'string' }
        },
        page: {
          name: 'page',
          in: 'query',
          required: false,
          schema: { type: 'integer', default: 1 }
        },
        size: {
          name: 'size',
          in: 'query',
          required: false,
          schema: { type: 'integer', default: 20 }
        },
        sort: {
          name: 'sort',
          in: 'query',
          required: false,
          schema: { type: 'string', default: 'asc' }
        },
        XClinicId: {
          name: 'X-Clinic-Id',
          in: 'header',
          required: true,
          schema: { type: 'string' },
          description: 'Id of the affiliated clinic'
        },
        patientId: {
          name: 'patientId',
          in: 'path',
          required: true,
          schema: { type: 'string' }
        }
      }
    },
    schemas
  },
  apis: ['./dist/**/*.js']
};
