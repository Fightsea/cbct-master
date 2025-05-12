import { Model as ObjModel } from 'objection';
import CbctAiOutput from './cbctAiOutput';

interface CbctAiOutputFile extends Model.CbctAiOutputFile {}

class CbctAiOutputFile extends ObjModel {
  static tableName = 'cbct_ai_output_files';

  static jsonSchema = {
    type: 'object',
    required: [
      'filename',
      'originalname',
      'mimetype',
      'size',
      'path',
      'outputId'
    ],
    properties: {
      id: { type: 'string' },
      filename: { type: 'string' },
      originalname: { type: 'string' },
      mimetype: { type: 'string' },
      size: { type: 'number' },
      path: { type: 'string' },
      outputId: { type: 'string' }
    }
  };

  static relationMappings = () => ({
    output: {
      relation: ObjModel.BelongsToOneRelation,
      modelClass: CbctAiOutput,
      join: {
        from: 'cbct_ai_output_files.outputId',
        to: 'cbct_ai_outputs.id'
      }
    }
  });

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default CbctAiOutputFile;
