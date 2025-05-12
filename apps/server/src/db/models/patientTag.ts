import { Model as ObjModel } from 'objection';
import Patient from './patient';
import Tag from './tag';

interface PatientTag extends Model.PatientTag {}

class PatientTag extends ObjModel {
  static tableName = 'patient_tags';

  static jsonSchema = {
    type: 'object',
    required: ['patientId', 'tagId'],
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string' },
      tagId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    patient: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: Patient,
      join: {
        from: 'patient_tags.patientId',
        to: 'patients.id'
      }
    },
    tag: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: Tag,
      join: {
        from: 'patient_tags.tagId',
        to: 'tags.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default PatientTag;
