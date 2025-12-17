import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { errorSchema } from "data/schemas/core.schema";
import { createOrderSchema } from "data/schemas/orders/create.shema";
import { generateID } from "utils/generateID.utils";

test.describe("[API] [Sales Portal] [Orders] [Delete]", () => {
  test.describe.configure({ mode: "parallel" });

  let token = "";
  let orderId: string | null = null;

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
    orderId = null;
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (!orderId) return;

    await ordersApiService.delete(orderId, token).catch(() => {});
    orderId = null;
  });

  test(
    "Should delete order with valid id and token",
    { tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const [customer, product] = await Promise.all([
        customersApiService.create(token),
        productsApiService.create(token),
      ]);

      const createdOrder = await ordersApiService.create(
        { customer: customer._id, products: [product._id] },
        token
      );

      orderId = createdOrder._id;

      const deleteResponse = await ordersController.delete(orderId, token);
      validateResponse(deleteResponse, { status: STATUS_CODES.DELETED });

      const getResponse = await ordersController.getByID(orderId, token);
      validateResponse(getResponse, {
        status: STATUS_CODES.NOT_FOUND,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: `Order with id '${orderId}' wasn't found`,
      });

      orderId = null;
    }
  );

  test(
    "Should NOT delete order with invalid token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const invalidToken = "Invalid access token";

      const [customer, product] = await Promise.all([
        customersApiService.create(token),
        productsApiService.create(token),
      ]);

      const createdOrder = await ordersApiService.create(
        { customer: customer._id, products: [product._id] },
        token
      );

      orderId = createdOrder._id;

      const response = await ordersController.delete(orderId, invalidToken);
      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Invalid access token",
      });
    }
  );

  test(
    "Should NOT delete order without token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const emptyToken = "";

      const [customer, product] = await Promise.all([
        customersApiService.create(token),
        productsApiService.create(token),
      ]);

      const createdOrder = await ordersApiService.create(
        { customer: customer._id, products: [product._id] },
        token
      );

      orderId = createdOrder._id;

      const response = await ordersController.delete(orderId, emptyToken);
      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Not authorized",
      });
    }
  );

  test(
    "Should NOT delete order with non-existent orderId",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();
      const nonexistentOrderId = generateID();

      const response = await ordersController.delete(nonexistentOrderId, token);
      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: `Order with id '${nonexistentOrderId}' wasn't found`,
      });
    }
  );

  test(
    "Should create order and return it by schema (sanity, uses createOrderSchema)",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersController }) => {
      const [customer, product] = await Promise.all([
        customersApiService.create(token),
        productsApiService.create(token),
      ]);

      const createResponse = await ordersController.create(
        { customer: customer._id, products: [product._id] },
        token
      );

      validateResponse(createResponse, {
        status: STATUS_CODES.CREATED,
        schema: createOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      orderId = createResponse.body!.Order._id;
      expect(orderId).toBeTruthy();
    }
  );
});
