import { COUNTRIES } from "data/salesPortal/customers/countries";

export const customerSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    email: {
      type: "string",
    },
    name: {
      type: "string",
    },
    country: {
      type: "string",
      enum: Object.values(COUNTRIES),
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
    phone: {
      type: "string",
    },
    createdOn: {
      type: "string",
    },
    notes: {
      type: "string",
    },
  },
  required: [
    "_id",
    "email",
    "name",
    "city",
    "street",
    "house",
    "flat",
    "country",
    "phone",
    "createdOn",
  ],
  additionalProperties: false,
};
