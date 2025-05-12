import { Model as ObjModel } from 'objection';
import CbctRecord from './cbctRecord';

interface CbctImage extends Model.CbctImage {}

class CbctImage extends ObjModel {
  static tableName = 'cbct_images';

  static jsonSchema = {
    type: 'object',
    required: [
      'filename',
      'originalname',
      'mimetype',
      'size',
      'path',
      'recordId'
    ],
    properties: {
      id: { type: 'string' },
      filename: { type: 'string' },
      originalname: { type: 'string' },
      mimetype: { type: 'string' },
      size: { type: 'number' },
      path: { type: 'string' },
      recordId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    record: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: CbctRecord,
      join: {
        from: 'cbct_images.recordId',
        to: 'cbct_records.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default CbctImage;
