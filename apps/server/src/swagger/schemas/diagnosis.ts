export const createRequest = {
  type: 'object',
  properties: {
    datetime: {
      type: 'string',
      format: 'date-time'
    },
    note: {
      type: 'string'
    },
    patientId: {
      type: 'string',
      format: 'uuid'
    },
    doctorId: {
      type: 'string',
      format: 'uuid'
    },
    tagIds: {
      type: 'array',
      items: {
        type: 'string',
        format: 'uuid'
      },
      minItems: 1
    }
  }
};
