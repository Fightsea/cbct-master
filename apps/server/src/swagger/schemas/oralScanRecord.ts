export const getRecordsResponse = {
  type: 'object',
  properties: {
    date: { type: 'string', format: 'date' },
    files: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
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
    files: {
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

export const createRequest = {
  type: 'object',
  properties: {
    patientId: { type: 'string', format: 'uuid' },
    files: {
      type: 'array',
      items: { type: 'string', format: 'binary' }
    }
  }
};
