import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { errorSchema } from "data/schemas/core.schema";
import { createOrderSchema } from "data/schemas/orders/create.shema";
import { extractIds } from "utils/extractIds.utils";
import { generateID } from "utils/generateID.utils";

test.describe("[API] [Sales Portal] [Orders] [Create]", () => {
  test.describe.configure({ mode: "parallel" });

  let token = "";
  let orderId: string | null = null;
  let orderCreated = false;

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
    orderId = null;
    orderCreated = false;
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (!orderCreated || !orderId) return;
    await ordersApiService.delete(orderId, token).catch(() => {});
    orderId = null;
    orderCreated = false;
  });

  test(
    "Should create order with all valid data (token, valid customerId, productId) and one product",
    { tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ ordersController, ordersApiService, customersApiService, productsApiService }) => {
      const [createdCustomer, createdProduct] = await Promise.all([
        customersApiService.create(token),
        productsApiService.create(token),
      ]);

      const order = await ordersApiService.create(
        { customer: createdCustomer._id, products: [createdProduct._id] },
        token
      );

      orderId = order._id;
      orderCreated = true;

      expect(orderId).toBeTruthy();
      expect(order.customer?._id ?? order.customer).toBe(createdCustomer._id);
      expect(order.products.length).toBe(1);

      const getResponse = await ordersController.getByID(orderId, token);

      validateResponse(getResponse, {
        status: STATUS_CODES.OK,
        schema: createOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const persisted = getResponse.body!.Order;
      expect(persisted._id).toBe(orderId);
      expect(persisted.customer._id).toBe(createdCustomer._id);
      expect(persisted.products.length).toBe(1);
      expect(persisted.products[0]!._id).toBe(createdProduct._id);
    }
  );

  test(
    "Should create order with all valid data (token, valid customerId, productId) and 5 products",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, ordersApiService, customersApiService, productsApiService }) => {
      const [createdCustomer, createdProducts] = await Promise.all([
        customersApiService.create(token),
        productsApiService.createBulk(5, token),
      ]);

      const productIds = extractIds(createdProducts);

      const order = await ordersApiService.create(
        { customer: createdCustomer._id, products: productIds },
        token
      );

      orderId = order._id;
      orderCreated = true;

      expect(orderId).toBeTruthy();
      expect(order.products.length).toBe(5);

      const getResponse = await ordersController.getByID(orderId, token);

      validateResponse(getResponse, {
        status: STATUS_CODES.OK,
        schema: createOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const persisted = getResponse.body!.Order;
      expect(persisted._id).toBe(orderId);
      expect(persisted.customer._id).toBe(createdCustomer._id);
      expect(persisted.products.length).toBe(5);

      const persistedProductIds = persisted.products.map(p => p._id).sort();
      expect(persistedProductIds).toEqual(productIds.slice().sort());
    }
  );

  test(
    "Should NOT create order with all valid data (token, valid customerId, productId) and 6 products",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      const [createdCustomer, createdProducts] = await Promise.all([
        customersApiService.create(token),
        productsApiService.createBulk(6, token),
      ]);

      const productIds = extractIds(createdProducts);

      const response = await ordersController.create(
        { customer: createdCustomer._id, products: productIds },
        token
      );

      validateResponse(response, {
        status: STATUS_CODES.BAD_REQUEST,
        IsSuccess: false,
        ErrorMessage: "Incorrect request body",
        schema: errorSchema,
      });
    }
  );

  test(
    "Should NOT create order with invalid customerId",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, productsApiService }) => {
      const invalidCustomerId = generateID();

      const createdProduct = await productsApiService.create(token);

      const response = await ordersController.create(
        { customer: invalidCustomerId, products: [createdProduct._id] },
        token
      );

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
        ErrorMessage: `Customer with id '${invalidCustomerId}' wasn't found`,
        schema: errorSchema,
      });
    }
  );

  test(
    "Should NOT create order with 1 invalid productId",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService }) => {
      const invalidProductId = generateID();

      const createdCustomer = await customersApiService.create(token);

      const response = await ordersController.create(
        { customer: createdCustomer._id, products: [invalidProductId] },
        token
      );

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
        ErrorMessage: `Product with id '${invalidProductId}' wasn't found`,
        schema: errorSchema,
      });
    }
  );

  test(
    "Should NOT create order if one of productIds is invalid",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, customersApiService, productsApiService }) => {
      const [createdCustomer, createdProducts] = await Promise.all([
        customersApiService.create(token),
        productsApiService.createBulk(3, token),
      ]);

      const productIds = extractIds(createdProducts);
      const invalidProductId = generateID();

      const response = await ordersController.create(
        { customer: createdCustomer._id, products: [...productIds, invalidProductId] },
        token
      );

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
        ErrorMessage: `Product with id '${invalidProductId}' wasn't found`,
        schema: errorSchema,
      });
    }
  );
});
