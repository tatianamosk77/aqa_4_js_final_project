import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { getOrderSchema } from "data/schemas/orders/getOrder.schema";
import { errorSchema } from "data/schemas/core.schema";
import { generateID } from "utils/generateID.utils";
import { ORDER_HISTORY_ACTIONS } from "data/orders/historyActions.data";

test.describe("[API] [Sales Portal] [Orders] [Unassign Manager]", () => {
  test.describe.configure({ mode: "parallel" });

  let token = "";
  let managerId = "";

  let orderId: string | null = null;
  let customerId: string | null = null;
  let productId: string | null = null;

  test.beforeAll(async ({ loginApiService }) => {
    const admin = await loginApiService.loginAsAdminWithUser();
    managerId = admin.userId;
    if (!managerId) throw new Error("No managerId retrieved from loginAsAdminWithUser");
  });

  test.beforeEach(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();

    orderId = null;
    customerId = null;
    productId = null;
  });

  test.afterEach(async ({ ordersApiService, customersApiService, productsApiService }) => {
    if (orderId) await ordersApiService.delete(orderId, token);
    if (customerId) await customersApiService.delete(token, customerId);
    if (productId) await productsApiService.delete(token, productId);

    orderId = null;
    customerId = null;
    productId = null;
  });

  async function createOrderFx(deps: {
    token: string;
    customersApiService: any;
    productsApiService: any;
    ordersApiService: any;
  }) {
    const { token, customersApiService, productsApiService, ordersApiService } = deps;

    const [customer, product] = await Promise.all([
      customersApiService.create(token),
      productsApiService.create(token),
    ]);

    customerId = customer._id;
    productId = product._id;

    const order = await ordersApiService.create(
      { customer: customer._id, products: [product._id] },
      token
    );

    orderId = order._id;
    return order;
  }

  test(
    "Should unassign manager with valid orderId and token",
    { tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ ordersController, ordersApiService, customersApiService, productsApiService }) => {
      const order = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      await ordersController.assignManager(order._id, managerId, token);

      const response = await ordersController.unassignManager(order._id, token);

      validateResponse(response, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updated = response.body!.Order;

      expect(updated._id).toBe(order._id);
      expect.soft(updated.assignedManager).toBeNull();

      const actions = updated.history?.map(h => h.action) ?? [];
      if ((ORDER_HISTORY_ACTIONS as any).MANAGER_UNASSIGNED) {
        expect.soft(actions).toContain((ORDER_HISTORY_ACTIONS as any).MANAGER_UNASSIGNED);
      }

      const getResponse = await ordersController.getByID(order._id, token);
      validateResponse(getResponse, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      expect.soft(getResponse.body!.Order.assignedManager).toBeNull();
    }
  );

  test(
    "Should NOT unassign manager with invalid token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, ordersApiService, customersApiService, productsApiService }) => {
      const invalidToken = "Invalid access token";

      const order = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      await ordersController.assignManager(order._id, managerId, token);

      const response = await ordersController.unassignManager(order._id, invalidToken);

      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Invalid access token",
      });
    }
  );

  test(
    "Should NOT unassign manager without token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, ordersApiService, customersApiService, productsApiService }) => {
      const emptyToken = "";

      const order = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      await ordersController.assignManager(order._id, managerId, token);

      const response = await ordersController.unassignManager(order._id, emptyToken);

      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Not authorized",
      });
    }
  );

  test(
    "Should NOT unassign manager with non-existent orderId",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController }) => {
      const nonexistentOrderId = generateID();

      const response = await ordersController.unassignManager(nonexistentOrderId, token);

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: `Order with id '${nonexistentOrderId}' wasn't found`,
      });
    }
  );

  test(
    "Should allow unassigning when no manager is assigned (no error, history added)",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ ordersController, ordersApiService, customersApiService, productsApiService }) => {
      const order = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const response = await ordersController.unassignManager(order._id, token);

      validateResponse(response, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updated = response.body!.Order;

      expect.soft(updated.assignedManager).toBeNull();
      const actions = updated.history?.map(h => h.action) ?? [];
      expect.soft(actions.length).toBeGreaterThan(0);
    }
  );
});
