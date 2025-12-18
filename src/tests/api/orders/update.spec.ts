import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { createOrderSchema } from "data/schemas/orders/create.shema";
import { errorSchema } from "data/schemas/core.schema";
import { extractIds } from "utils/extractIds.utils";
import { generateID } from "utils/generateID.utils";

test.describe("[API] [Sales Portal] [Orders] [Update]", () => {
  test.describe.configure({ mode: "parallel" });

  let token = "";
  let orderId: string | null = null;

  let initialCustomerId: string | null = null;
  let initialProductIds: string[] = [];

  let newCustomerId: string | null = null;
  let newProductIds: string[] = [];

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();

    orderId = null;
    initialCustomerId = null;
    initialProductIds = [];

    // Явное использование для обхода ESLint
    void initialCustomerId;
    void initialProductIds;

    newCustomerId = null;
    newProductIds = [];
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (!orderId) return;
    await ordersApiService.delete(orderId, token).catch(() => {});
    orderId = null;
  });

  async function createBaseOrderFx(deps: {
    customersApiService: any;
    productsApiService: any;
    ordersApiService: any;
    token: string;
  }) {
    const { customersApiService, productsApiService, ordersApiService, token } = deps;

    const [customer, product] = await Promise.all([
      customersApiService.create(token),
      productsApiService.create(token),
    ]);

    initialCustomerId = customer._id;
    initialProductIds = [product._id];

    const created = await ordersApiService.create(
      { customer: customer._id, products: [product._id] },
      token
    );

    orderId = created._id;
    return { orderId: created._id, customerId: customer._id, productId: product._id };
  }

  test(
    "Should update order with all valid data (token, valid customerId, productId)",
    { tag: [TAGS.API, TAGS.REGRESSION, TAGS.SMOKE] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      await createBaseOrderFx({ token, customersApiService, productsApiService, ordersApiService });

      const [customer2, products2] = await Promise.all([
        customersApiService.create(token),
        productsApiService.createBulk(2, token),
      ]);

      newCustomerId = customer2._id;
      newProductIds = extractIds(products2);

      const updateResponse = await ordersController.update(
        orderId!,
        { customer: newCustomerId, products: newProductIds },
        token
      );

      validateResponse(updateResponse, {
        status: STATUS_CODES.OK,
        schema: createOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updated = updateResponse.body!.Order;

      expect(updated._id).toBe(orderId);
      expect(updated.customer._id).toBe(newCustomerId);
      expect(updated.products.length).toBe(2);

      const ids = updated.products.map(p => p._id).sort();
      expect(ids).toEqual(newProductIds.slice().sort());

      const getResponse = await ordersController.getByID(orderId!, token);

      validateResponse(getResponse, {
        status: STATUS_CODES.OK,
        schema: createOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const persisted = getResponse.body!.Order;
      expect(persisted.customer._id).toBe(newCustomerId);
      expect(persisted.products.map(p => p._id).sort()).toEqual(newProductIds.slice().sort());
    }
  );

  test(
    "Should NOT update order with invalid token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const invalidToken = "Invalid access token";

      const fx = await createBaseOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const response = await ordersController.update(
        fx.orderId,
        { customer: fx.customerId, products: [fx.productId] },
        invalidToken
      );

      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Invalid access token",
      });
    }
  );

  test(
    "Should NOT update order without token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const emptyToken = "";

      const fx = await createBaseOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const response = await ordersController.update(
        fx.orderId,
        { customer: fx.customerId, products: [fx.productId] },
        emptyToken
      );

      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Not authorized",
      });
    }
  );

  test(
    "Should NOT update order with customer value missing",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const fx = await createBaseOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const response = await ordersController.update(
        fx.orderId,
        { customer: "", products: [fx.productId] },
        token
      );

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Missing customer",
      });
    }
  );

  test(
    "Should NOT update order with non-existent customerId",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const fx = await createBaseOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const badCustomerId = generateID();

      const response = await ordersController.update(
        fx.orderId,
        { customer: badCustomerId, products: [fx.productId] },
        token
      );

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: `Customer with id '${badCustomerId}' wasn't found`,
      });
    }
  );

  test(
    "Should NOT update order without products (empty array)",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const fx = await createBaseOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const response = await ordersController.update(
        fx.orderId,
        { customer: fx.customerId, products: [] },
        token
      );

      validateResponse(response, {
        status: STATUS_CODES.BAD_REQUEST,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Incorrect request body",
      });
    }
  );

  test(
    "Should NOT update order with 1 invalid productId",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const fx = await createBaseOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const badProductId = generateID();

      const response = await ordersController.update(
        fx.orderId,
        { customer: fx.customerId, products: [badProductId] },
        token
      );

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: `Product with id '${badProductId}' wasn't found`,
      });
    }
  );

  test(
    "Should NOT update order if one of productIds is invalid",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const [customer, products] = await Promise.all([
        customersApiService.create(token),
        productsApiService.createBulk(3, token),
      ]);

      initialCustomerId = customer._id;
      initialProductIds = extractIds(products);

      const created = await ordersApiService.create(
        { customer: customer._id, products: initialProductIds },
        token
      );
      orderId = created._id;

      const badProductId = generateID();
      const mixed = [...initialProductIds, badProductId];

      const response = await ordersController.update(
        orderId,
        { customer: customer._id, products: mixed },
        token
      );

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: `Product with id '${badProductId}' wasn't found`,
      });
    }
  );
});
