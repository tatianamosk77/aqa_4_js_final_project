import { obligatoryFieldsSchema, obligatoryRequredFields } from '../core.schema';
import { customerSchema } from './customer.schema';

export const getSortedCustomersSchema = {
  type: 'object',
  properties: {
    Customers: {
      type: 'array',
      items: customerSchema,
    },
    total: { type: 'number' },
    page: { type: 'number' },
    limit: { type: 'number' },
    search: { type: 'string' },
    country: {
      type: 'array',
      items: { type: 'string' },
    },
    sorting: {
      type: 'object',
      properties: {
        sortField: {
          type: 'string',
          enum: ['createdOn', 'country', 'email', 'name'],
        },
        sortOrder: {
          type: 'string',
          enum: ['asc', 'desc'],
        },
      },
      required: ['sortField', 'sortOrder'],
      additionalProperties: false,
    },
    ...obligatoryFieldsSchema,
  },
  required: [
    'Customers',
    'total',
    'page',
    'limit',
    'search',
    'country',
    'sorting',
    ...obligatoryRequredFields,
  ],
  additionalProperties: false,
};
