export const getAffiliatedResponse = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      address: { type: 'string' },
      userCount: { type: 'number' }
    }
  }
};

export const getPhotoResponse = {
  type: 'string',
  example: 'https://www.example.com/path/to/image.png'
};

export const createRequest = {
  type: 'object',
  required: ['name', 'taxId', 'phone', 'address'],
  properties: {
    name: { type: 'string', maxLength: 30 },
    taxId: { type: 'string', maxLength: 30 },
    phone: { type: 'string', maxLength: 20 },
    address: { type: 'string' },
    image: { type: 'string', format: 'binary' }
  }
};
