import { CustomersApi } from "api/api/customers.api";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { createCustomerSchema } from "data/schemas/customers/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomer } from "data/types/customer.types";
import { logStep } from "utils/report/logStep.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class CustomersApiService {
    constructor(private customersApi: CustomersApi) { }

    @logStep("Customer creation")
    async create(token: string, customerData?: ICustomer) {
        const data = generateCustomerData(customerData);
        const response = await this.customersApi.create(data, token);
        validateResponse(response, {
            status: STATUS_CODES.CREATED,
            IsSuccess: true,
            ErrorMessage: null,
            schema: createCustomerSchema,
        });
        return response.body.Customer;
    }

    @logStep("Customer removal")
    async delete(token: string, id: string) {
        const response = await this.customersApi.delete(id, token);
        validateResponse(response, {
            status: STATUS_CODES.DELETED,
        });
    }
}
