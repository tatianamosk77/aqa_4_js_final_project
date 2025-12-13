import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { orderSchema } from "../orders/order.schema";

export const getCustomerOrdersSchema = {
  type: "object",
  properties: {
    Orders: {
      type: "array",
      items: orderSchema,
    },
    ...obligatoryFieldsSchema,
  },
  required: ["Orders", ...obligatoryRequredFields],
  additionalProperties: false,
};
