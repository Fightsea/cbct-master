import { Model as ObjModel } from 'objection';
import Patient from './patient';

interface PatientPhoto extends Model.PatientPhoto {}

class PatientPhoto extends ObjModel {
  static tableName = 'patient_photos';

  static jsonSchema = {
    type: 'object',
    required: [
      'type',
      'filename',
      'originalname',
      'mimetype',
      'size',
      'path',
      'patientId'
    ],
    properties: {
      id: { type: 'string' },
      type: { type: 'string' },
      filename: { type: 'string' },
      originalname: { type: 'string' },
      mimetype: { type: 'string' },
      size: { type: 'number' },
      path: { type: 'string' },
      patientId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    patient: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: Patient,
      join: {
        from: 'patient_photos.patientId',
        to: 'patients.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default PatientPhoto;
