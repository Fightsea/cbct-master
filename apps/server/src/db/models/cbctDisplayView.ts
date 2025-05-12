import { Model as ObjModel } from 'objection';
import CbctRecord from './cbctRecord';

interface CbctDisplayView extends Model.CbctDisplayView {}

class CbctDisplayView extends ObjModel {
  static tableName = 'cbct_display_views';

  static jsonSchema = {
    type: 'object',
    required: ['resource', 'recordId'],
    properties: {
      id: { type: 'string' },
      resource: { type: 'string' },
      recordId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    record: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: CbctRecord,
      join: {
        from: 'cbct_display_views.recordId',
        to: 'cbct_records.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default CbctDisplayView;
