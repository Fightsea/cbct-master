export const loginRequest = {
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email'
    },
    password: {
      type: 'string'
    }
  }
};

export const loginResponse = {
  type: 'object',
  properties: {
    user: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'uuid'
        },
        name: {
          type: 'string'
        },
        email: {
          type: 'string',
          format: 'email'
        },
        position: {
          type: 'string'
        }
      }
    },
    accessToken: {
      type: 'string'
    },
    refreshToken: {
      type: 'string'
    }
  }
};

export const refreshTokenResponse = loginResponse;
