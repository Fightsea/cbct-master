import * as authSchemas from './auth';
import * as patientSchemas from './patient';
import * as tagSchemas from './tag';
import * as clinicSchemas from './clinic';
import * as diagnosisSchemas from './diagnosis';
import * as patientPhotoSchemas from './patientPhoto';
import * as xrayRecordSchemas from './xrayRecord';
import * as oralScanRecordSchemas from './oralScanRecord';
import * as cbctRecordSchemas from './cbctRecord';
import * as cbctAiOutputSchemas from './cbctAiOutput';

export default {
  auth: authSchemas,
  patient: patientSchemas,
  tag: tagSchemas,
  clinic: clinicSchemas,
  diagnosis: diagnosisSchemas,
  patientPhoto: patientPhotoSchemas,
  xrayRecord: xrayRecordSchemas,
  oralScanRecord: oralScanRecordSchemas,
  cbctRecord: cbctRecordSchemas,
  cbctAiOutput: cbctAiOutputSchemas
};
