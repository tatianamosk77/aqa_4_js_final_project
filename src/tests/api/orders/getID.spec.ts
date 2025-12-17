import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { getOrderSchema } from "data/schemas/orders/getOrder.schema";
import { errorSchema } from "data/schemas/core.schema";
import { generateID } from "utils/generateID.utils";

type ApiErrorResponse = {
  IsSuccess: boolean;
  ErrorMessage: string;
  Order?: unknown;
};

test.describe("[API] [Sales Portal] [Orders] [Get by ID]", () => {
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
    "Should get order with valid id and token",
    { tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const [customer, product] = await Promise.all([
        customersApiService.create(token),
        productsApiService.create(token),
      ]);

      const order = await ordersApiService.create(
        { customer: customer._id, products: [product._id] },
        token
      );

      orderId = order._id;

      const response = await ordersController.getByID(order._id, token);

      validateResponse(response, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const returnedOrder = response.body!.Order;

      expect(returnedOrder._id).toBe(order._id);
      expect(returnedOrder.customer?._id ?? returnedOrder.customer).toBe(customer._id);

      expect(returnedOrder.products.length).toBeGreaterThan(0);

      const returnedProduct = returnedOrder.products[0]!;
      expect(returnedProduct._id).toBe(product._id);
      expect(returnedProduct.name).toBe(product.name);
      expect(returnedProduct.price).toBe(product.price);
      expect(returnedProduct.amount).toBe(product.amount);
      expect(returnedProduct.manufacturer).toBe(product.manufacturer);
      expect(returnedProduct.notes).toBe(product.notes);
    }
  );

  test(
    "Should NOT get order with non-existent id",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const invalidId = generateID();

      const response = await ordersController.getByID(invalidId, token);

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: `Order with id '${invalidId}' wasn't found`,
      });

      const body = response.body as ApiErrorResponse;

      expect(body.IsSuccess).toBe(false);
      expect(body.ErrorMessage).toBe(`Order with id '${invalidId}' wasn't found`);
    }
  );

  test(
    "Should NOT get order with invalid token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const [customer, product] = await Promise.all([
        customersApiService.create(token),
        productsApiService.create(token),
      ]);

      const order = await ordersApiService.create(
        { customer: customer._id, products: [product._id] },
        token
      );

      orderId = order._id;

      const response = await ordersController.getByID(order._id, "Invalid access token");

      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Invalid access token",
      });

      const body = response.body as ApiErrorResponse;

      expect(body.IsSuccess).toBe(false);
      expect(body.ErrorMessage).toBe("Invalid access token");
      expect(body.Order).toBeUndefined();
    }
  );

  test(
    "Should NOT get order without token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const [customer, product] = await Promise.all([
        customersApiService.create(token),
        productsApiService.create(token),
      ]);

      const order = await ordersApiService.create(
        { customer: customer._id, products: [product._id] },
        token
      );

      orderId = order._id;

      const response = await ordersController.getByID(order._id, "");

      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Not authorized",
      });

      const body = response.body as ApiErrorResponse;

      expect(body.IsSuccess).toBe(false);
      expect(body.ErrorMessage).toBe("Not authorized");
    }
  );
});
