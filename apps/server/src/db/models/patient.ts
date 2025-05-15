import { Model as ObjModel } from 'objection';
import { softDelete } from '@/utils/objection';
import Clinic from './clinic';
import Tag from './tag';
import Diagnosis from './diagnosis';
import CbctRecord from './cbctRecord';

interface Patient extends Model.Patient {}

class Patient extends softDelete(ObjModel) {
  tags?: Tag[]
  
  static tableName = 'patients';

  static jsonSchema = {
    type: 'object',
    required: [
      'serialNumber',
      'email',
      'idNumber',
      'treatmentStatus',
      'firstName',
      'lastName',
      'gender',
      'birthday',
      'phone',
      'height',
      'weight',
      'clinicId'
    ],
    properties: {
      id: { type: 'string' },
      pinned: { type: 'boolean' },
      serialNumber: { type: 'string' },
      email: { type: 'string' },
      idNumber: { type: 'string' },
      treatmentStatus: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      gender: { type: 'string' },
      birthday: { type: 'string' },
      phone: { type: 'string' },
      note: { type: 'string' },
      height: { type: 'number' },
      weight: { type: 'number' },
      clinicId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    clinic: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: Clinic,
      join: {
        from: 'patients.clinicId',
        to: 'clinics.id'
      }
    },
    tags: {
      relation: ObjModel.ManyToManyRelation,
      modelClass: Tag,
      join: {
        from: 'patients.id',
        through: {
          from: 'patient_tags.patientId',
          to: 'patient_tags.tagId'
        },
        to: 'tags.id'
      }
    },
    diagnoses: {
      relation: ObjModel.HasManyRelation,
      modelClass: Diagnosis,
      join: {
        from: 'patients.id',
        to: 'diagnoses.patientId'
      }
    },
    cbctRecords: {
      relation: ObjModel.HasManyRelation,
      modelClass: CbctRecord,
      join: {
        from: 'patients.id',
        to: 'cbct_records.patientId'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default Patient;
