import { MANUFACTURERS } from "data/salesPortal/products/manufacturers";
import { baseSchemaPart, productsMetaSchema, sortingSchemaPart } from "data/schemas/base.schemas";

export const productSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    name: { type: "string" },
    price: { type: "number" },
    amount: { type: "number" },
    manufacturer: {
      type: "string",
      enum: Object.values(MANUFACTURERS),
    },
    createdOn: { type: "string", format: "date-time" },
    notes: { type: "string" },
  },
  required: ["_id", "name", "price", "amount", "manufacturer", "createdOn"],
  additionalProperties: false,
} as const;

export const oneProductResponseSchema = {
  type: "object",
  properties: {
    Product: {
      ...productSchema,
    },
    ...baseSchemaPart,
  },
  required: ["Product", "IsSuccess", "ErrorMessage"],
};

export const allProductsResponseSchema = {
  type: "object",
  properties: {
    Products: {
      type: "array",
      items: productSchema,
    },
    ...baseSchemaPart,
  },
  required: ["Products", "IsSuccess", "ErrorMessage"],
};

export const productsListSchema = {
  type: "object",
  properties: {
    Products: {
      type: "array",
      items: productSchema,
    },
    sorting: {
      type: "object",
      properties: sortingSchemaPart,
      required: ["sortField", "sortOrder"],
    },
    ...productsMetaSchema,
    ...baseSchemaPart,
  },
  required: ["Products", "sorting", "IsSuccess", "ErrorMessage", "total", "page", "limit", "search", "manufacturer"],
};
