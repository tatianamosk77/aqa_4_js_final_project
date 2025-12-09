export const commentOrderSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    text: { type: 'string' },
    createdOn: { type: 'string', format: 'date-time' }, // ISO 8601
  },
  required: ['_id', 'text', 'createdOn'],
  additionalProperties: false,
};
