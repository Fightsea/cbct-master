import { Role } from '@cbct/enum/clinicMember';
import { RedisCache } from '@/utils/redis';

declare global {
  namespace Express {
    interface Request {
      user?: UserJwt;
      redis?: RedisCache;
      clinicId?: uuid;
      clinicRole?: Role;
      patientId?: uuid;
      preGenId?: uuid;
    }
  }
}

export {};
