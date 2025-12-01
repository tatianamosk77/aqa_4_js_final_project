import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { customerSchema } from "./customer.schema";

export const createCustomerSchema = {
    type: "object",
    properties: {
        Customer: customerSchema,
        ...obligatoryFieldsSchema,
    },
    required: ["Customer", ...obligatoryRequredFields],
};
