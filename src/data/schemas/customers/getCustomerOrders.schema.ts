import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { orderInListWithCustomerIdSchema } from "../orders/order.schema";

export const getCustomerOrdersSchema = {
  type: "object",
  properties: {
    Orders: {
      type: "array",
      items: orderInListWithCustomerIdSchema,
    },
    ...obligatoryFieldsSchema,
  },
  required: ["Orders", ...obligatoryRequredFields],
  additionalProperties: false,
};
