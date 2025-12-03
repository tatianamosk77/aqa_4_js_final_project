import { obligatoryFieldsSchema, obligatoryRequredFields } from '../core.schema';

export const orderProductSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    name: { type: 'string' },
    amount: { type: 'integer', minimum: 0 },
    price: { type: 'integer', minimum: 0 },
    manufacturer: { type: 'string' },
    notes: { type: 'string' },
    received: { type: 'boolean' },
  },
  required: ['_id', 'name', 'amount', 'price', 'manufacturer', 'notes', 'received'],
  additionalProperties: false,
};

export const historyPerformerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    username: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    roles: {
      type: 'array',
      items: { type: 'string' },
    },
    createdOn: { type: 'string' },
  },
  required: ['_id', 'username', 'firstName', 'lastName', 'roles', 'createdOn'],
  additionalProperties: false,
};

export const orderHistoryItemSchema = {
  type: 'object',
  properties: {
    status: { type: 'string' },
    customer: { type: 'string' },
    products: {
      type: 'array',
      items: orderProductSchema,
    },
    total_price: { type: 'integer', minimum: 0 },
    delivery: { type: ['object', 'null'] },
    changedOn: { type: 'string', format: 'date-time' },
    action: { type: 'string' },
    performer: historyPerformerSchema,
    assignedManager: { type: ['string', 'null'] },
  },
  required: [
    'status',
    'customer',
    'products',
    'total_price',
    'delivery',
    'changedOn',
    'action',
    'performer',
    'assignedManager',
  ],
  additionalProperties: false,
};

// временно
export const assignedManagerSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    username: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
  },
  required: ['_id', 'username', 'firstName', 'lastName'],
  additionalProperties: false,
};

export const orderSchema = {
  type: 'object',
  properties: {
    _id: { type: 'string' },
    status: { type: 'string' },
    customer: { type: 'string' },
    products: {
      type: 'array',
      items: orderProductSchema,
    },
    delivery: { type: ['object', 'null'] },
    total_price: { type: 'integer', minimum: 0 },
    createdOn: { type: 'string', format: 'date-time' },
    comments: {
      type: 'array',
      items: { type: 'object' }, // временно
    },
    history: {
      type: 'array',
      items: orderHistoryItemSchema,
    },
    assignedManager: {
      oneOf: [{ type: 'string' }, assignedManagerSchema, { type: 'null' }],
    },
  },
  required: [
    '_id',
    'status',
    'customer',
    'products',
    'delivery',
    'total_price',
    'createdOn',
    'comments',
    'history',
    'assignedManager',
  ],
  additionalProperties: false,
};

export const getCustomerOrdersSchema = {
  type: 'object',
  properties: {
    Orders: {
      type: 'array',
      items: orderSchema,
    },
    ...obligatoryFieldsSchema,
  },
  required: ['Orders', ...obligatoryRequredFields],
  additionalProperties: false,
};

export const customerOrdersSchema = getCustomerOrdersSchema;
