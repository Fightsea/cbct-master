import { Model as ObjModel } from 'objection';
import XrayRecord from './xrayRecord';

interface OralScanFile extends Model.OralScanFile {}

class OralScanFile extends ObjModel {
  static tableName = 'oral_scan_files';

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
        from: 'oral_scan_files.recordId',
        to: 'oral_scan_records.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default OralScanFile;
