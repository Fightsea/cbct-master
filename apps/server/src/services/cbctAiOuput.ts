import { Knex } from 'knex';
import db from '@/db';
import type { AnalyzeResponse } from '@/apis/types/osaPhenotyping';
import { CbctAiOutput, CbctAiOutputFile, CbctRecord } from '@/db/models';
import { convertS3UriToUrl, getImageUrl } from '@/utils/media';
import osaPhenotypingApi from '@/apis/routes/osaPhenotyping';
import { CbctAiOutputStatus } from '@cbct/enum/cbct';
import { deleteFile, uploadBinary } from '@/utils/s3';
import { getAge } from '@cbct/utils/moment';
import { calculateBmi } from '@cbct/utils/math';
import { parseBase64ToText } from '@/utils/string';

export const convertAnalyzeResult = async (id: uuid, result: AnalyzeResponse) => {
  // Convert to .nii.gz by request body
  let niiBuffer: ArrayBuffer;
  try {
    niiBuffer = await osaPhenotypingApi.convertToNii(result);
  } catch (e: any) {
    console.error(e);
    throw new Error('CONVERT_NII_FAILED');
  }

  const recordId = await CbctAiOutput.query(db)
    .findById(id)
    .select('recordId')
    .then(o => o!.recordId);

  // Upload to S3
  const filename = `${id}.nii.gz`;
  const s3Key = `patient/cbct/${recordId}/output/${filename}`;

  await db.transaction(async trx => {
    // Update output
    await CbctAiOutput.query(trx)
      .patch({
        risk: result.risk,
        phenotype: result.phenotype,
        phenotypeImageUrl: result.phenotype_pic ? convertS3UriToUrl(result.phenotype_pic) : null,
        treatmentDescription: result.treatment_description,
        treatmentImageUrl: result.treatment_pic ? convertS3UriToUrl(result.treatment_pic) : null,
        prescription: parseBase64ToText(result.encoded_prescription),
        status: CbctAiOutputStatus.COMPLETED
      })
      .where('id', id);

    // Create file
    await CbctAiOutputFile.query(trx).insert({
      filename,
      originalname: filename,
      mimetype: 'application/gzip',
      path: s3Key,
      size: niiBuffer.byteLength,
      outputId: id
    });

    // Upload to S3
    await uploadBinary(s3Key, niiBuffer);
  });
};

export const analyze = async (id: uuid) => {
  const recordId = await CbctAiOutput.query(db)
    .findById(id)
    .select('recordId')
    .first()
    .then(o => o!.recordId);

  const patient = await CbctRecord.query(db)
    .withGraphFetched('patient')
    .findById(recordId)
    .first()
    .then(r => r!.patient!);

  // Send user data to OSA Phenotyping API for analysis
  const analyzeResponse = await osaPhenotypingApi.analyze({
    user_id: id,
    age: getAge(patient.birthday),
    sex: patient.gender.toLowerCase(),
    bmi: calculateBmi(patient.height, patient.weight),
    image: `s3://${process.env.S3_BUCKET}/patient/cbct/${recordId}/input/`
  });

  // Convert analysis result to NII file and upload to S3
  await convertAnalyzeResult(id, analyzeResponse);
};

export const destroy = async (db: Knex.Transaction, recordId: uuid) => {
  const outputId = await CbctAiOutput.query(db)
    .where('recordId', recordId)
    .select('id')
    .first()
    .then(o => o?.id);

  if (!outputId) return;

  const file = await CbctAiOutputFile.query(db).where('outputId', outputId).first();
  if (file) {
    await deleteFile(file.path);
    await CbctAiOutputFile.query(db).delete().where('outputId', outputId);
  }

  await CbctAiOutput.query(db).delete().where('id', outputId);
};

export const getFirstFileUrl = async (id: uuid): Promise<Nullable<Url>> => {
  const file = await CbctAiOutputFile.query(db)
    .where('outputId', id)
    .select('path')
    .first();

  return file ? getImageUrl(file.path) : null;
};
