import { Model as ObjModel } from 'objection';
import Patient from './patient';
import CbctImage from './cbctImage';
import CbctAiOutput from './cbctAiOutput';
import CbctDisplayView from './cbctDisplayView';

interface CbctRecord extends Model.CbctRecord {}

class CbctRecord extends ObjModel {
  static tableName = 'cbct_records';

  static jsonSchema = {
    type: 'object',
    required: ['date', 'patientId'],
    properties: {
      id: { type: 'string' },
      date: { type: 'string' },
      patientId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    patient: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: Patient,
      join: {
        from: 'cbct_records.patientId',
        to: 'patients.id'
      }
    },
    output: {
      relation: ObjModel.HasOneRelation,
      modelClass: CbctAiOutput,
      join: {
        from: 'cbct_records.id',
        to: 'cbct_ai_outputs.recordId'
      }
    },
    images: {
      relation: ObjModel.HasManyRelation,
      modelClass: CbctImage,
      join: {
        from: 'cbct_records.id',
        to: 'cbct_images.recordId'
      }
    },
    views: {
      relation: ObjModel.HasManyRelation,
      modelClass: CbctDisplayView,
      join: {
        from: 'cbct_records.id',
        to: 'cbct_display_views.recordId'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default CbctRecord;
