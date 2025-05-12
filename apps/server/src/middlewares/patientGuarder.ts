import { Request, Response, NextFunction } from 'express';
import db from '@/db';
import { ForbiddenError } from '@/utils/error';
import { RedisKey } from '@/constants/enum/redis';
import { Patient } from '@/db/models';
import { Header } from '@/constants/enum/http';
import clinicGuarder from './clinicGuarder';

const patientGuarder = (
  dataSource: RequestDataSource,
  key: string
) => async (req: Request, _: Response, next: NextFunction) => {
  const patientId = req[dataSource][key];

  try {
    const patient = await req.redis!.get(
      `${RedisKey.PATIENT}:${patientId}`,
      () => Patient.query(db).findById(patientId).execute()
    );

    if (!patient) {
      throw new Error();
    }

    // Set patient data in req context
    req.patientId = patientId;
    req.headers[Header.X_CLINIC_ID] = patient.clinicId;
  } catch {
    next(new ForbiddenError());
  }

  next();
};

export default (dataSource: RequestDataSource, key: string) => [
  patientGuarder(dataSource, key),
  clinicGuarder
];
