import { Model as ObjModel } from 'objection';
import XrayRecord from './xrayRecord';

interface XrayImage extends Model.XrayImage {}

class XrayImage extends ObjModel {
  static tableName = 'xray_images';

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
      modelClass: XrayRecord,
      join: {
        from: 'xray_images.recordId',
        to: 'xray_records.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default XrayImage;
