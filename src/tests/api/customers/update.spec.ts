import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { ERROR_MESSAGES } from "data/salesPortal/notifications";
import { errorSchema } from "data/schemas/core.schema";
import { TAGS } from "data/tags";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { createCustomerSchema } from "data/schemas/customers/create.schema";
import { getRandomEnumValue } from "utils/enum.utils";
import { COUNTRIES } from "data/salesPortal/customers/countries";

test.describe("[API] [Sales Portal] [Customers]", () => {
  test.describe("Smoke", () => {
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
      "Update customer",
      {
        tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
      },
      async ({ loginApiService, customersApiService, customersApi }) => {
        //TODO: Preconditions
        token = await loginApiService.loginAsAdmin();
        const createdCustomer = await customersApiService.create(token);
        ids.push(createdCustomer._id);

        //TODO: Action
        const updatedCustomerData = generateCustomerData();
        const updatedCustomerResponse = await customersApi.update(
          createdCustomer._id,
          updatedCustomerData,
          token
        );

        //TODO: Assert
        validateResponse(updatedCustomerResponse, {
          status: STATUS_CODES.OK,
          schema: createCustomerSchema,
          IsSuccess: true,
          ErrorMessage: null,
        });

        const updatedCustomer = updatedCustomerResponse.body.Customer;
        expect(_.omit(updatedCustomer, ["_id", "createdOn"])).toEqual(updatedCustomerData);
        expect(createdCustomer._id).toBe(updatedCustomer._id);
      }
    );
  });

  test.describe("NOT SMOKE", () => {
    const ids: string[] = [];
    let token = "";

    test.beforeEach(async ({ loginApiService }) => {
      token = await loginApiService.loginAsAdmin();
    });
    test.afterEach(async ({ customersApiService }) => {
      if (ids.length) {
        for (const id of ids) {
          await customersApiService.delete(token, id);
        }
        ids.length = 0;
      }
    });

    test(
      "Should NOT update customer without token",
      {
        tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
      },
      async ({ customersApi, customersApiService }) => {
        const customer = await customersApiService.create(token);
        ids.push(customer._id);

        const response = await customersApi.update(customer._id, generateCustomerData(), "");
        validateResponse(response, {
          IsSuccess: false,
          status: STATUS_CODES.UNAUTHORIZED,
          ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
          schema: errorSchema,
        });
      }
    );

    test(
      "Should NOT update customer with not existing id",
      {
        tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
      },
      async ({ customersApi }) => {
        const id = "690a3cfbef33a32d75a96737";
        const response = await customersApi.update(id, generateCustomerData(), token);
        validateResponse(response, {
          IsSuccess: false,
          status: STATUS_CODES.NOT_FOUND,
          ErrorMessage: ERROR_MESSAGES.CUSTOMER_NOT_FOUND(id),
          schema: errorSchema,
        });
      }
    );

    test(
      "Should NOT update customer with existing customer email",
      {
        tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
      },
      async ({ customersApi, customersApiService }) => {
        const customer1 = await customersApiService.create(token);
        const customer2 = await customersApiService.create(token);

        ids.push(customer1._id, customer2._id);

        const response = await customersApi.update(
          customer1._id,
          generateCustomerData({ email: customer2.email }),
          token
        );
        validateResponse(response, {
          IsSuccess: false,
          status: STATUS_CODES.CONFLICT,
          ErrorMessage: ERROR_MESSAGES.CUSTOMER_ALREADY_EXISTS(customer2.email),
          schema: errorSchema,
        });
      }
    );

    test(
      "Should update customer with max valid data",
      {
        tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
      },
      async ({ customersApi, customersApiService }) => {
        const customer = await customersApiService.create(token);
        ids.push(customer._id);
        const customerData = {
          email: "test666@test.com",
          name: "Customeeeeeeeeeeer Customeeeeeeeeeeeeeer",
          country: getRandomEnumValue(COUNTRIES),
          city: "Ciiiiiiiitttttyyyyyy", // requires 40, but successful with 20
          flat: 9999,
          house: 999,
          notes:
            "FugGijgp9M7HnljmfGpmqL2A8WqDnxSv0XdGDImYs8poMqJgkaD7rbqv9HyZzPZtGU6JxKOhvg6OvihDqoCdQ6aGZ3ekUg9aIZJYuKkXoAP4qwKAyK9dNj5LZMUjZw0SekIs3apD77gwMC8HBgJu9u1R2870NuDwp8wPrEWag5aFIEKmTeoP7XLRlLDYI7cEo8feLmvO9b2nvjs2LtE0DYUPhMuMrqHunMhbPdwieMw16CSYWisdw9hlRz",
          phone: "+79570919939992323424",
          street: "Sssssssssssttttttttrrrrrrrrrrreeeetttttt",
        };
        const response = await customersApi.update(
          customer._id,
          generateCustomerData(customerData),
          token
        );
        validateResponse(response, {
          IsSuccess: true,
          status: STATUS_CODES.OK,
          ErrorMessage: null,
          schema: createCustomerSchema,
        });

        expect(_.omit(response.body.Customer, ["_id", "createdOn"])).toEqual(customerData);
      }
    );

    test(
      "Should update customer with min valid data",
      {
        tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
      },
      async ({ customersApi, customersApiService }) => {
        const customer = await customersApiService.create(token);
        ids.push(customer._id);
        const customerData = {
          email: "test666@test.com",
          name: "N",
          country: COUNTRIES.CANADA,
          city: "C",
          flat: 1,
          house: 1,
          notes: "",
          phone: "+7957091993",
          street: "S",
        };
        const response = await customersApi.update(
          customer._id,
          generateCustomerData(customerData),
          token
        );
        validateResponse(response, {
          IsSuccess: true,
          status: STATUS_CODES.OK,
          ErrorMessage: null,
          schema: createCustomerSchema,
        });
        expect(_.omit(response.body.Customer, ["_id", "createdOn"])).toEqual(customerData);
      }
    );
  });
});
