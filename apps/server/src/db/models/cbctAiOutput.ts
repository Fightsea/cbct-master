import { Model as ObjModel } from 'objection';
import CbctRecord from './cbctRecord';

interface CbctAiOutput extends Model.CbctAiOutput {}

class CbctAiOutput extends ObjModel {
  static tableName = 'cbct_ai_outputs';

  static jsonSchema = {
    type: 'object',
    required: ['date', 'model', 'status', 'recordId'],
    properties: {
      id: { type: 'string' },
      date: { type: 'string' },
      model: { type: 'string' },
      status: { type: 'string' },
      risk: { type: ['string', 'null'] },
      phenotype: { type: ['string', 'null'] },
      phenotypeImageUrl: { type: ['string', 'null'] },
      prescription: { type: ['string', 'null'] },
      treatmentDescription: { type: ['string', 'null'] },
      treatmentImageUrl: { type: ['string', 'null'] },
      recordId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    record: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: CbctRecord,
      join: {
        from: 'cbct_ai_outputs.recordId',
        to: 'cbct_records.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default CbctAiOutput;
