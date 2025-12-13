import { orderSchema } from "./order.schema";
import { ordersMetaSchema } from "../base.schemas";
import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";

export const getOrdersListSchema = {
  type: "object",
  properties: {
    Orders: {
      type: "array",
      items: {
        allOf: [orderSchema],
      },
    },
    Metadata: {
      type: "object",
      allOf: [ordersMetaSchema],
    },
    ...obligatoryFieldsSchema,
  },
  required: ["Orders", "Metadata", ...obligatoryRequredFields],
  additionalProperties: false,
};
