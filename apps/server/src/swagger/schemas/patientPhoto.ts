import { PatientPhotoType } from '@cbct/enum/patientPhoto';

export const getPhotosResponse = {
  type: 'object',
  additionalProperties: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        url: { type: 'string', format: 'url' },
        date: { type: 'string', format: 'date' }
      }
    }
  },
  example: {
    '2024-10-16': [{
      'id': '62fa77fd-af5a-4538-9adb-ebd174332926',
      'url': 'https://www.example.com/path/to/image.png',
      'date': '2024-10-16'
    }],
    '2024-10-12': [{
      'id': 'c6f04282-37a4-42a6-bd9c-00a380dc852f',
      'url': 'https://www.example.com/path/to/image.png',
      'date': '2024-10-12'
    }]
  }
};

export const getTaggedResponse = {
  type: 'object',
  properties: {
    front: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        url: { type: 'string', example: 'https://www.example.com/path/to/image.png' }
      },
      nullable: true
    },
    profile: {
      type: 'object',
      properties: {
        id: { type: 'string', format: 'uuid' },
        url: { type: 'string', example: 'https://www.example.com/path/to/image.png' }
      },
      nullable: true
    }
  }
};

export const uploadRequest = {
  type: 'object',
  properties: {
    frontFileName: { type: 'string', nullable: true },
    profileFileName: { type: 'string', nullable: true },
    patientId: { type: 'string', format: 'uuid' },
    images: {
      type: 'array',
      items: { type: 'string', format: 'binary' }
    }
  }
};

export const switchTypeRequest = {
  type: 'object',
  properties: {
    type: {
      type: 'string',
      enum: [PatientPhotoType.FRONT, PatientPhotoType.PROFILE]
    }
  }
};
