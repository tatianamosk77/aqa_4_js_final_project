import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { orderSchema } from "./order.schema";

export const createOrderSchema = {
  type: "object",
  properties: {
    Order: {
      type: "object",
      allOf: [orderSchema],
    },

    ...obligatoryFieldsSchema,
  },
  required: ["Order", ...obligatoryRequredFields],
  additionalProperties: false,
};
