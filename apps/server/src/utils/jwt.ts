import Jwt from 'jsonwebtoken';

export const generate = (
  payload: Jwt.JwtPayload,
  secret: Jwt.Secret,
  expiresIn?: string | number
): string => {
  return Jwt.sign(payload, secret, {
    ...expiresIn && { expiresIn },
    algorithm: 'HS256'
  });
};

export const genAccessToken = (user: Model.User): string => {
  return generate({
    id: user.id,
    email: user.email,
    position: user.position,
    aud: process.env.JWT_AUDIENCE!,
    iss: process.env.JWT_ISSUER!
  },
    process.env.JWT_SECRET!,
    +process.env.JWT_EXPIRESIN!
  );
};

export const genRefreshToken = (user: Model.User): string => {
  return generate({
    id: user.id,
    email: user.email,
    position: user.position,
    aud: process.env.JWT_AUDIENCE!,
    iss: process.env.JWT_ISSUER!
  },
    process.env.REFRESH_TOKEN_SECRET!,
    +process.env.REFRESH_TOKEN_EXPIRESIN!
  );
};

export const verify = (secret: Jwt.Secret, token?: string): boolean => {
  if (!token) return false;

  try {
    Jwt.verify(token, secret);
    return true;
  } catch {
    return false;
  }
};

export const decode = <T>(token: string): T => {
  return Jwt.decode(token) as T;
};
