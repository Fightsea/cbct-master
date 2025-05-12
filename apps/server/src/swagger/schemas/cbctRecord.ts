import { CbctAiModel, CbctAiOutputStatus } from '@cbct/enum/cbct';

export const getRecordsResponse = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    date: { type: 'string', format: 'date' },
    images: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          url: { type: 'string', example: 'https://www.example.com/path/to/image.png' }
        }
      }
    },
    views: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          url: { type: 'string', example: 'https://www.example.com/path/to/image.png' }
        }
      }
    }
  }
};

export const getByIdResponse = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    date: { type: 'string', format: 'date' },
    patientId: { type: 'string', format: 'uuid' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    directory: { type: 'string' },
    images: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          originalName: { type: 'string' },
          url: { type: 'string', example: 'https://www.example.com/path/to/image.png' }
        }
      }
    }
  }
};

export const getAiOutputResponse = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    date: { type: 'string', format: 'date' },
    model: { type: 'string', enum: Object.values(CbctAiModel) },
    status: { type: 'string', enum: Object.values(CbctAiOutputStatus) },
    risk: { type: 'string', nullable: true },
    phenotype: { type: 'string', nullable: true },
    phenotypeImageUrl: { type: 'string', nullable: true },
    treatmentDescription: { type: 'string', nullable: true },
    treatmentImageUrl: { type: 'string', nullable: true },
    prescription: { type: 'string', nullable: true },
    fileUrl: { type: 'string', nullable: true }
  }
};

export const createRequest = {
  type: 'object',
  properties: {
    patientId: { type: 'string', format: 'uuid' },
    images: {
      type: 'array',
      items: { type: 'string', format: 'binary' }
    }
  }
};

export const createResponse = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' }
  }
};
