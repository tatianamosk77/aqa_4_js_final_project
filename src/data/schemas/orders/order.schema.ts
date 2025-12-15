import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { customerSchema } from "data/schemas/customers/customer.schema";
import { ORDER_STATUS } from "data/orders/statuses.data";
import { commentOrderSchema } from "data/schemas/comments/orderComments.schema";
import { ordersMetaSchema } from "../base.schemas";

export const productInOrderSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    amount: { type: "integer", minimum: 0 },
    price: { type: "integer", minimum: 0 },
    manufacturer: { type: "string" },
    notes: { type: "string" },
    received: { type: "boolean" },
  },
  required: ["_id", "name", "amount", "price", "manufacturer", "notes", "received"],
  additionalProperties: false,
};

export const performerSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    username: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    roles: {
      type: "array",
      items: { type: "string" },
    },
    createdOn: { type: "string" }, // Дата в формате '2025/10/23 16:51:13'
  },
  required: ["_id", "username", "firstName", "lastName", "roles", "createdOn"],
  additionalProperties: false,
};

export const orderHistoryItemSchema = {
  type: "object",
  properties: {
    status: { type: "string" },
    customer: { type: "string" },
    products: {
      type: "array",
      items: productInOrderSchema,
    },
    total_price: { type: "number", minimum: 0 },
    delivery: { type: ["object", "null"] },
    changedOn: { type: "string", format: "date-time" },
    action: { type: "string" },
    performer: performerSchema,
    assignedManager: { type: ["string", "object", "null"] },
  },

  required: [
    "status",
    "customer",
    "products",
    "total_price",
    "delivery",
    "changedOn",
    "action",
    "performer",
    "assignedManager",
  ],
  additionalProperties: false,
};

export const assignedManagerSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    username: { type: "string" },
    firstName: { type: "string" },
    lastName: { type: "string" },
    roles: {
      type: "array",
      items: { type: "string" },
    },
    createdOn: { type: "string" },
  },
  required: ["_id", "username", "firstName", "lastName", "roles", "createdOn"],
  additionalProperties: false,
};

export const deliverySchema = {
  type: "object",
  properties: {
    address: {
      type: "object",
      properties: {
        country: {
          type: "string",
        },
        city: {
          type: "string",
        },
        street: {
          type: "string",
        },
        house: {
          type: "number",
        },
        flat: {
          type: "number",
        },
      },

      required: ["country", "city", "street", "house", "flat"],
      additionalProperties: false,
    },
    finalDate: {
      type: "string",
      format: "date-time",
    },
    condition: {
      type: "string",
      enum: ["Pickup", "Delivery"],
    },
  },

  required: ["address", "finalDate", "condition"],
  additionalProperties: false,
};

export const orderSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    status: { type: "string", enum: Object.values(ORDER_STATUS) },
    customer: { type: "object", allOf: [customerSchema] },
    products: {
      type: "array",
      items: productInOrderSchema,
    },
    delivery: {
      oneOf: [{ type: "null" }, { allOf: [deliverySchema] }],
    },
    total_price: { type: "number", minimum: 0 },
    createdOn: { type: "string", format: "date-time" },
    comments: {
      type: "array",
      items: commentOrderSchema,
    },
    history: {
      type: "array",
      items: orderHistoryItemSchema,
    },
    assignedManager: {
      oneOf: [{ type: "string" }, assignedManagerSchema, { type: "null" }],
    },
  },
  required: [
    "_id",
    "status",
    "customer",
    "products",
    "delivery",
    "total_price",
    "createdOn",
    "comments",
    "history",
    "assignedManager",
  ],
  additionalProperties: false,
};

export const orderInListSchema = {
  ...orderSchema,
  properties: {
    ...orderSchema.properties,
    customer: {
      oneOf: [{ type: "string" }, { type: "object", allOf: [customerSchema] }],
    },
  },
};

export const getCustomerOrdersSchema = {
  type: "object",
  properties: {
    Orders: {
      type: "array",
      items: orderInListSchema,
    },
    ...obligatoryFieldsSchema,
  },
  required: ["Orders", ...obligatoryRequredFields],
  additionalProperties: false,
};

export const ordersListSchema = {
  type: "object",
  properties: {
    Orders: {
      type: "array",
      items: orderSchema,
    },
    ...ordersMetaSchema.properties,
    ...obligatoryFieldsSchema,
  },
  required: ["Orders", ...obligatoryRequredFields],
};

export const customerOrdersSchema = getCustomerOrdersSchema;

export const orderInListWithCustomerIdSchema = {
  ...orderSchema,
  properties: {
    ...orderSchema.properties,
    customer: { type: "string" },
  },
};