import { Model as ObjModel } from 'objection';

interface Tag extends Model.Tag {}

class Tag extends ObjModel {
  static tableName = 'tags';

  static jsonSchema = {
    type: 'object',
    required: ['name', 'color', 'clinicId'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      color: { type: 'string' },
      clinicId: { type: 'string' }
    }
  };

  $beforeUpdate(): void | Promise<any> {
    this.updatedAt = new Date().toISOString();
  }
}

export default Tag;
