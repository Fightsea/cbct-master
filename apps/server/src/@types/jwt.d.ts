declare global {
  type UserJwt = {
    id: uuid;
    email: string;
    position: string;
    aud: string;
    iss: string;
    iat: string;
    exp: string;
  }

  type ThirdPartyJwt = {
    id: uuid;
    type: string;
  }
}

export {};
