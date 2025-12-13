import { CustomersApi } from "api/api/customers.api";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { createCustomerSchema } from "data/schemas/customers/create.schema";
import { getCustomerSchema } from "data/schemas/customers/get.schema";
import { getAllCustomersSchema } from "data/schemas/customers/getAll.schema";
import { getCustomerOrdersSchema } from "data/schemas/customers/getCustomerOrders.schema";
import { getSortedCustomersSchema } from "data/schemas/customers/getSorted.schema";
import { STATUS_CODES } from "data/statusCodes";
import {
  ICustomer,
  ICustomersSortedResponse,
  ICustomerOrdersResponse,
  IGetCustomersParams,
  ICustomerFromResponse,
} from "data/types/customer.types";
import { logStep } from "utils/report/logStep.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class CustomersApiService {
  constructor(private customersApi: CustomersApi) {}

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

    return response.body.Customer as ICustomerFromResponse;
  }

  @logStep("Customer update")
  async update(token: string, id: string, newData?: ICustomer) {
    const data = generateCustomerData(newData);
    const response = await this.customersApi.update(id, data, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getCustomerSchema,
    });

    return response.body.Customer as ICustomerFromResponse;
  }

  @logStep("Get customer by id")
  async getById(token: string, id: string) {
    const response = await this.customersApi.getById(id, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getCustomerSchema,
    });

    return response.body.Customer as ICustomerFromResponse;
  }

  @logStep("Get all customers")
  async getAll(token: string) {
    const response = await this.customersApi.getAll(token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getAllCustomersSchema,
    });

    return response.body.Customers as ICustomerFromResponse[];
  }

  @logStep("Get sorted customers")
  async getSorted(token: string, params?: Partial<IGetCustomersParams>) {
    const response = await this.customersApi.getSorted(token, params);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getSortedCustomersSchema,
    });

    return response.body as ICustomersSortedResponse;
  }

  @logStep("Customer removal")
  async delete(token: string, id: string): Promise<void> {
    const response = await this.customersApi.delete(id, token);

    validateResponse(response, {
      status: STATUS_CODES.DELETED,
      IsSuccess: true,
      ErrorMessage: null,
    });
  }

  @logStep("Get customer orders")
  async getCustomerOrders(token: string, id: string) {
    const response = await this.customersApi.getCustomerOrders(id, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getCustomerOrdersSchema,
    });

    return response.body as ICustomerOrdersResponse;
  }
}
