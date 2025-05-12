export const getByClinicResponse = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid'
      },
      name: {
        type: 'string'
      },
      color: {
        type: 'string',
        format: 'color'
      }
    }
  }
};

export const createRequest = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    color: {
      type: 'string',
      format: 'color'
    }
  }
};

export const createResponse = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      format: 'uuid'
    }
  }
};

export const updateRequest = createRequest;
