import db from '@/db';
import { ClinicMember } from '@/db/models';
import { AffiliatedClinic } from '@cbct/api/response/auth';

export const getAffiliatedClinics = async (id: uuid) => {
  return await ClinicMember.query(db)
    .joinRelated('clinic')
    .where('userId', id)
    .select('clinic.id', 'clinic.name', 'role')
    .castTo<AffiliatedClinic[]>();
};
