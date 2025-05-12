import { DiagnosisAnalysisType } from '@cbct/enum/diagnosisAnalysis';
import { TreatmentStatus } from '@cbct/enum/patient';
import { Gender } from '@cbct/enum/user';

export const searchWithPagingResponse = {
  type: 'object',
  properties: {
    results: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          pinned: { type: 'boolean' },
          serialNumber: { type: 'string' },
          treatmentStatus: { type: 'string', enum: Object.values(TreatmentStatus) },
          name: { type: 'string' },
          osaRisk: { type: 'boolean', nullable: true },
          note: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          tags: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string', format: 'uuid' },
                name: { type: 'string' },
                color: { type: 'string', format: 'color' }
              }
            }
          }
        }
      }
    },
    total: { type: 'number' },
    search: { type: 'string' },
    page: { type: 'number' },
    size: { type: 'number' },
    order: { type: 'string' },
    sort: { type: 'string' }
  }
};

export const getNewSerialNumberResponse = {
  type: 'string'
};

export const getByIdResponse = {
  type: 'object',
  properties: {
    data: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        pinned: { type: 'boolean' },
        serialNumber: { type: 'string' },
        email: { type: 'string', format: 'email' },
        idNumber: { type: 'string' },
        treatmentStatus: { type: 'string', enum: Object.values(TreatmentStatus) },
        firstName: { type: 'string' },
        lastName: { type: 'string' },
        gender: { type: 'string', enum: Object.values(Gender) },
        birthday: { type: 'string', format: 'date' },
        phone: { type: 'string' },
        height: { type: 'number' },
        weight: { type: 'number' },
        note: { type: 'string' },
        clinicId: { type: 'string', format: 'uuid' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        deletedAt: { type: 'string', format: 'date-time', nullable: true },
        tags: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string', format: 'uuid' },
              name: { type: 'string' },
              color: { type: 'string', format: 'color' }
            }
          }
        },
        bmi: { type: 'number' }
      }
    }
  }
};

export const getAvatarResponse = {
  type: 'string',
  example: 'https://www.example.com/path/to/image.png'
};

export const getHistoryResponse = {
  type: 'object',
  properties: {
    data: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          date: { type: 'string', format: 'date' },
          type: { type: 'string', enum: Object.values(DiagnosisAnalysisType) },
          subject: { type: 'string' },
          description: { type: 'string' },
          patientId: { type: 'string', format: 'uuid' },
          tags: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: { type: 'string' },
                color: { type: 'string', format: 'color' }
              }
            }
          }
        }
      }
    }
  }
};

export const getOsaRiskResponse = {
  type: 'boolean',
  nullable: true
};

export const createRequest = {
  type: 'object',
  properties: {
    serialNumber: { type: 'string', maxLength: 30 },
    email: { type: 'string', format: 'email', maxLength: 50 },
    idNumber: { type: 'string', maxLength: 20 },
    treatmentStatus: { type: 'string', enum: Object.values(TreatmentStatus) },
    firstName: { type: 'string', maxLength: 30 },
    lastName: { type: 'string', maxLength: 30 },
    gender: { type: 'string', enum: Object.values(Gender) },
    birthday: { type: 'string', format: 'date' },
    phone: { type: 'string', maxLength: 20 },
    note: { type: 'string' },
    tagIds: {
      type: 'array',
      items: { type: 'string', format: 'uuid' },
      minItems: 1
    }
  }
};

export const createResponse = {
  type: 'object',
  properties: {
    id: { type: 'string', format: 'uuid' },
    serialNumber: { type: 'string' }
  }
};

export const updateRequest = createRequest;

export const switchStatusRequest = {
  type: 'object',
  properties: {
    treatmentStatus: {
      type: 'string',
      enum: Object.values(TreatmentStatus)
    }
  }
};

export const updatePinnedRequest = {
  type: 'object',
  properties: {
    pinned: { type: 'boolean' }
  }
};
