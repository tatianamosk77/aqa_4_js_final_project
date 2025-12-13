import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { getAllCustomersSchema } from "data/schemas/customers/getAll.schema";

test.describe("[API] [Sales Portal] [Customers]", () => {
  const ids: string[] = [];
  let token = "";

  test.afterEach(async ({ customersApiService }) => {
    if (ids.length) {
      for (const id of ids) {
        await customersApiService.delete(token, id);
      }
      ids.length = 0;
    }
  });

  test(
    "Get All Customers",
    {
      tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
    },
    async ({ loginApiService, customersApiService, customersApi, page }) => {
      //TODO: Preconditions
      token = await loginApiService.loginAsAdmin();
      const customer1 = await customersApiService.create(token);
      await page.waitForTimeout(5000);
      const customer2 = await customersApiService.create(token);

      ids.push(customer1._id, customer2._id);

      //TODO: Action

      const getCustomersResponse = await customersApi.getAll(token);
      validateResponse(getCustomersResponse, {
        status: STATUS_CODES.OK,
        schema: getAllCustomersSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });
      //TODO: Assert
      const actualCustomers = getCustomersResponse.body.Customers;

      expect(actualCustomers).toEqual(expect.arrayContaining([customer1, customer2]));
      //expect(actualCustomers).toHaveLength(2);
    }
  );
});
