import { Model as ObjModel } from 'objection';
import Patient from './patient';
import User from './user';
import Tag from './tag';

interface Diagnosis extends Model.Diagnosis {}

class Diagnosis extends ObjModel {
  static tableName = 'diagnoses';

  static jsonSchema = {
    type: 'object',
    required: [
      'datetime',
      'note',
      'patientId',
      'doctorId'
    ],
    properties: {
      id: { type: 'string' },
      datetime: { type: 'string' },
      note: { type: 'string' },
      patientId: { type: 'string' },
      doctorId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    patient: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: Patient,
      join: {
        from: 'diagnoses.patientId',
        to: 'patients.id'
      }
    },
    doctor: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: 'diagnoses.doctorId',
        to: 'users.id'
      }
    },
    tags: {
      relation: ObjModel.ManyToManyRelation,
      modelClass: Tag,
      join: {
        from: 'diagnoses.id',
        through: {
          from: 'diagnosis_tags.diagnosisId',
          to: 'diagnosis_tags.tagId'
        },
        to: 'tags.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default Diagnosis;
