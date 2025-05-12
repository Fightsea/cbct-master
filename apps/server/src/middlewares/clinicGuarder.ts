import { Request, Response, NextFunction } from 'express';
import { Header } from '@/constants/enum/http';
import { ForbiddenError } from '@/utils/error';
import { getAffiliatedClinics } from '@/services/user';
import { RedisKey } from '@/constants/enum/redis';

type XClinicIdHeader = IdHeader;

const clinicGuarder = async (req: Request, _: Response, next: NextFunction) => {
  const clinicId = req.headers[Header.X_CLINIC_ID] as XClinicIdHeader;

  try {
    const affiliatedClinics = await req.redis!.get(
      `${RedisKey.USER_CLINICS}:${req.user!.id}`,
      () => getAffiliatedClinics(req.user!.id)
    );

    const targetClinic = affiliatedClinics.find(c => c.id === clinicId);

    if (!targetClinic) {
      throw new Error();
    }

    // Set clinic data in req context
    req.clinicId = clinicId;
    req.clinicRole = targetClinic.role;
  } catch {
    next(new ForbiddenError());
  }

  next();
};

export default clinicGuarder;
