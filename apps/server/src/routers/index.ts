import { Router } from 'express';
import authRouter from '@/routers/auth';
import tagRouter from '@/routers/tag';
import patientRouter from '@/routers/patient';
import clinicRouter from '@/routers/clinic';
import diagnosisRouter from '@/routers/diagnosis';
import patientPhotoRouter from '@/routers/patientPhoto';
import xrayRecordRouter from '@/routers/xrayRecord';
import oralScanRecordRouter from '@/routers/oralScanRecord';
import cbctRecordRouter from '@/routers/cbctRecord';
import cbctAiOutputRouter from '@/routers/cbctAiOutput';
import cbctImageRouter from '@/routers/cbctImage';
import oralScanFileRouter from '@/routers/oralScanFile';
import xrayImageRouter from '@/routers/xrayImage';

const rootRouter: Router = Router();

[
  { path: '/auth', router: authRouter },
  { path: '/tags', router: tagRouter },
  { path: '/patients', router: patientRouter },
  { path: '/clinics', router: clinicRouter },
  { path: '/diagnoses', router: diagnosisRouter },
  { path: '/patient-photos', router: patientPhotoRouter },
  { path: '/xray/records', router: xrayRecordRouter },
  { path: '/xray/images', router: xrayImageRouter },
  { path: '/oral-scan/records', router: oralScanRecordRouter },
  { path: '/oral-scan/files', router: oralScanFileRouter },
  { path: '/cbct/records', router: cbctRecordRouter },
  { path: '/cbct/ai-outputs', router: cbctAiOutputRouter },
  { path: '/cbct/images', router: cbctImageRouter }
]
  .forEach(({ path, router }) => rootRouter.use(path, router));

export default rootRouter;
