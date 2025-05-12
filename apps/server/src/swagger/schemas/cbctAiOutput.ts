import { CbctAiModel } from '@cbct/enum/cbct';

export const getInputImagesResponse = {
  type: 'object',
  properties: {
    urls: {
      type: 'array',
      items: {
        type: 'string',
        example: 'https://www.example.com/path/to/image.png'
      }
    },
    count: { type: 'number' }
  }
};

export const createRequest = {
  type: 'object',
  properties: {
    recordId: {
      type: 'string',
      format: 'uuid'
    },
    model: {
      type: 'string',
      enum: Object.values(CbctAiModel)
    }
  }
};

export const completeRequest = {
  type: 'object',
  properties: {
    statusCode: { type: 'number', example: 200 },
    user_id: { type: 'string' },
    risk: { type: 'string', nullable: true },
    phenotype: { type: 'string', example: 'skeletal' },
    encoded_prescription: {
      type: 'string',
      example: 'H4sIAFyOoGcC/41XwXLbNhC95yv20qmdkdQkbpKpb4r...'
    },
    segmentation_results: {
      type: 'string',
      example: 'H4sIAFqOoGcC/+zawXLbOhBFQYP//9Hv2Y4SxXE4l+IYsYjulRciFjenIKoqLy8AAA...'
    },
    reconstruction_params: {
      type: 'object',
      properties: {
        shape: {
          type: 'array',
          items: { type: 'number' },
          example: [368, 552, 552]
        },
        props: {
          type: 'object',
          properties: {
            sitk_stuff: {
              type: 'object',
              properties: {
                spacing: {
                  type: 'array',
                  items: { type: 'number' },
                  example: [0.25, 0.25, 0.25]
                },
                origin: {
                  type: 'array',
                  items: { type: 'number' },
                  example: [-69, -69, -45.75]
                },
                direction: {
                  type: 'array',
                  items: { type: 'number' },
                  example: [1, 0, 0, 0, 1, 0, 0, 0, 1]
                }
              }
            },
            shape_before_cropping: {
              type: 'array',
              items: { type: 'number' },
              example: [552, 368, 552]
            },
            bbox_used_for_cropping: {
              type: 'array',
              items: {
                type: 'array',
                items: { type: 'number' },
                example: [
                  [0, 552],
                  [0, 368],
                  [0, 552]
                ]
              }
            },
            shape_after_cropping_and_before_resampling: {
              type: 'array',
              items: { type: 'number' },
              example: [552, 368, 552]
            }
          }
        }
      }
    },
    landmark_co_results: {
      type: 'object',
      properties: {
        landmarks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              coordinates: {
                type: 'object',
                required: ['x', 'y', 'z'],
                properties: {
                  x: { type: 'number' },
                  y: { type: 'number' },
                  z: { type: 'number' }
                }
              }
            }
          },
          example: [
            {
              name: 'H',
              coordinates: {
                x: 68.61217108900593,
                y: 67.28606236140682,
                z: 8.988730520561528
              }
            }
          ]
        },
        metadata: {
          type: 'object',
          properties: {
            units: {
              type: 'object',
              properties: {
                x: { type: 'string' },
                y: { type: 'string' },
                z: { type: 'string' }
              },
              example: {
                x: 'mm',
                y: 'mm',
                z: 'mm'
              }
            },
            count: { type: 'number', example: 4 }
          }
        }
      }
    }
  }
};
