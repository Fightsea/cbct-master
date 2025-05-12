import objectionSoftDelete from 'objection-js-soft-delete';

export const softDelete = objectionSoftDelete({
  columnName: 'deletedAt',
  deletedValue: new Date(),
  notDeletedValue: null
});
