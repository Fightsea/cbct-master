import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import { verify, decode } from '@/utils/jwt';
import { UnauthorizedError } from '@/utils/error';
import { uuidv4 } from '@/utils/regex';

type WhiteList = {
  url: string | RegExp;
  methods: HttpMethod[];
};

type JwtAuthOptions = {
  secret: Jwt.Secret;
  whiteList?: WhiteList[];
}

const jwtAuth = ({ secret, whiteList = [] }: JwtAuthOptions) => (
  req: Request,
  _: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!checkWhiteList(whiteList, req.originalUrl, req.method)) {
    if (!verify(secret, token)) {
      throw new UnauthorizedError('UNAUTHORIZED');
    } else {
      req.user = decode<UserJwt>(token!);
    }
  }

  next();
};

const checkWhiteList = (whiteList: WhiteList[], url: string, method: string) => {
  return whiteList.some(route => {
    const urlMatches = typeof route.url === 'string' ? route.url === url : route.url.test(url);
    const methodMatches = route.methods.includes(method as HttpMethod);
    return urlMatches && methodMatches;
  });
};

export const jwtAuthMiddleware = jwtAuth({
  secret: process.env.JWT_SECRET!,
  whiteList: [
    { url: '/api/auth/login', methods: ['POST'] },
    { url: '/api/auth/token/refresh', methods: ['POST'] },
    { url: new RegExp(`^\/api\/cbct\/ai-outputs\/${uuidv4.source}\/complete$`), methods: ['PUT'] }
  ]
});

export const refreshTokenAuthMiddleware = jwtAuth({
  secret: process.env.REFRESH_TOKEN_SECRET!
});

export const thirdPartyAuthMiddleware = jwtAuth({
  secret: process.env.THIRD_PARTY_JWT_SECRET!
});
