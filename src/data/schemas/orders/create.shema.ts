import { obligatoryFieldsSchema, obligatoryRequredFields } from '../core.schema';
import { orderSchema } from './order.schema';

export const createOrderSchema = {
  type: 'object',
  properties: {
    Order: {
      type: 'object',
      allOf: [orderSchema],
    },

    ...obligatoryFieldsSchema,
  },
  required: ['Order', ...obligatoryRequredFields],
  additionalProperties: false,
};

// export const orderResponseRootSchema = {
//     type: 'object',
//     properties: {
//         Order: {
//             type: 'object',
//             properties: {
//                 _id: { type: 'string' },
//                 status: { type: 'string', enum: Object.values(ORDER_STATUS),},
//                 total_price: { type: 'number' },
//                 createdOn: { type: 'string' }, // ISO 8601: "2025-12-09T10:16:39.000Z"
//                 assignedManager: { type: ['string', 'null'] },
//                 delivery: { type: ['object', 'null'] },

//                 customer: { type: 'object', items: customerSchema },
//                 products: { type: 'array', items: productInOrderSchema },
//                 history: { type: 'array', items: orderHistoryItemSchema },
//                 comments: { type: 'array', items: { type: 'object' } },
//             },
//             required: [
//                 '_id', 'status', 'total_price', 'createdOn', 'assignedManager',
//                 'delivery', 'customer', 'products', 'history', 'comments'
//             ],
//             additionalProperties: false,
//         },
//         ...obligatoryFieldsSchema,
//     },
//     required: ['Order', 'IsSuccess', 'ErrorMessage'],
//     additionalProperties: false,
// };
