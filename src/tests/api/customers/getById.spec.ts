import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { getCustomerSchema } from "data/schemas/customers/get.schema";

test.describe("[API] [Sales Portal] [Customers]", () => {
  let id = "";
  let token = "";

  test.afterEach(async ({ customersApiService }) => {
    await customersApiService.delete(token, id);
  });

  test(
    "Get Customer By Id",
    {
      tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
    },
    async ({ loginApiService, customersApiService, customersApi }) => {
      //TODO: Preconditions
      token = await loginApiService.loginAsAdmin();
      const customer = await customersApiService.create(token);
      id = customer._id;

      //TODO: Action

      const getCustomerResponse = await customersApi.getById(id, token);
      validateResponse(getCustomerResponse, {
        status: STATUS_CODES.OK,
        schema: getCustomerSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });
      //TODO: Assert
      expect(getCustomerResponse.body.Customer).toEqual(customer);
    }
  );
});
