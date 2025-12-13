import { ORDER_STATUS } from "data/salesPortal/orders/statuses.data";

export const baseSchemaPart = {
  IsSuccess: {
    type: "boolean",
  },
  ErrorMessage: {
    type: ["string", "null"],
  },
};

export const sortingSchemaPart = {
  sortField: {
    type: "string",
  },
  sortOrder: {
    type: "string",
    enum: ["asc", "desc"],
  },
};

export const customersMetaSchema = {
  total: { type: "number" },
  page: { type: "number" },
  limit: { type: "number" },
  search: { type: "string" },
  country: {
    type: "array",
    items: { type: "string" },
  },
};

export const productsMetaSchema = {
  total: { type: "number" },
  page: { type: "number" },
  limit: { type: "number" },
  search: { type: "string" },
  manufacturer: {
    type: "array",
    items: { type: "string" },
  },
};

export const ordersMetaSchema = {
  type: "object",
  properties: {
    total: {
      type: "number",
    },
    page: {
      type: "number",
    },
    limit: {
      type: "number",
    },
    search: {
      type: "string",
    },

    sorting: {
      type: "object",
      properties: sortingSchemaPart,
      required: ["sortField", "sortOrder"],
    },

    status: {
      type: "array",
      items: {
        type: "string",
        enum: Object.values(ORDER_STATUS),
      },
    },
  },

  required: ["total", "page", "limit", "search", "sorting", "status"],
  additionalProperties: false,
};

// export const ordersMetaSchema = {
//   total: { type: "number" },
//   page: { type: "number" },
//   limit: { type: "number" },
//   search: { type: "string" },
//   status: {
//     type: "array",
//     items: Object.values(ORDER_STATUS),
//   },
// };

export const errorSchemaPart = {
  type: "object",
  properties: {
    IsSuccess: {
      type: "boolean",
    },
    ErrorMessage: {
      type: ["string", "null"],
    },
  },
};

export const validationErrorSchema = {
  ...errorSchemaPart,
  required: ["IsSuccess", "ErrorMessage"],
};
