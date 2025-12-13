import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { errorSchema } from "data/schemas/core.schema";
import { getOrderSchema } from "data/schemas/orders/getOrder.schema";
import { generateID } from "utils/generateID.utils";
import { ORDER_HISTORY_ACTIONS } from "data/orders/historyActions.data";

test.describe("[API] [Sales Portal] [Orders] [Assign Manager]", () => {
  test.describe.configure({ mode: "parallel" });

  let managerId = "";

  test.beforeAll(async ({ loginApiService }) => {
    const admin = await loginApiService.loginAsAdminWithUser();
    managerId = admin.userId;
    if (!managerId) throw new Error("No managerId retrieved from loginAsAdminWithUser");
  });

  type AssignFx = {
    token: string;
    orderId: string;
    customerId: string;
    productId: string;
  };

  async function createOrderFx(deps: {
    token: string;
    customersApiService: any;
    productsApiService: any;
    ordersApiService: any;
  }): Promise<AssignFx> {
    const { token, customersApiService, productsApiService, ordersApiService } = deps;

    const [customer, product] = await Promise.all([
      customersApiService.create(token),
      productsApiService.create(token),
    ]);

    const order = await ordersApiService.create(
      { customer: customer._id, products: [product._id] },
      token
    );

    return {
      token,
      orderId: order._id,
      customerId: customer._id,
      productId: product._id,
    };
  }

  async function cleanupAssignFx(
    fx: AssignFx,
    deps: { ordersApiService: any; customersApiService: any; productsApiService: any }
  ) {
    const { token, orderId, customerId, productId } = fx;

    await deps.ordersApiService.delete(orderId, token).catch(() => {});
    await deps.customersApiService.delete(token, customerId).catch(() => {});
    deps.productsApiService.delete(token, productId).catch(() => {});
  }

  test("Should assign manager with valid orderId, managerId and token",
    { tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({
      loginApiService,
      customersApiService,
      productsApiService,
      ordersApiService,
      ordersController,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const response = await ordersController.assignManager(fx.orderId, managerId, token);

      validateResponse(response, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const order = response.body!.Order;

      expect(order._id).toBe(fx.orderId);
      expect(order.assignedManager).toBeTruthy();

      if (order.assignedManager && typeof order.assignedManager !== "string") {
        expect(order.assignedManager._id).toBe(managerId);
      }

      const actions = order.history?.map(h => h.action) ?? [];
      if ((ORDER_HISTORY_ACTIONS as any).MANAGER_ASSIGNED) {
        expect(actions).toContain((ORDER_HISTORY_ACTIONS as any).MANAGER_ASSIGNED);
      }
      const getResponse = await ordersController.getByID(fx.orderId, token);

      validateResponse(getResponse, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const persisted = getResponse.body!.Order;
      expect(persisted.assignedManager).toBeTruthy();
      if (persisted.assignedManager && typeof persisted.assignedManager !== "string") {
        expect(persisted.assignedManager._id).toBe(managerId);
      }

      await cleanupAssignFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test("Should NOT assign manager with invalid token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();
      const invalidToken = "Invalid access token";

      const fx = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const response = await ordersController.assignManager(fx.orderId, managerId, invalidToken);

      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Invalid access token",
      });

      await cleanupAssignFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test("Should NOT assign manager without token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();
      const emptyToken = "";

      const fx = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const response = await ordersController.assignManager(fx.orderId, managerId, emptyToken);

      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Not authorized",
      });

      await cleanupAssignFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test("Should NOT assign manager with missing orderId",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();

      const response = await ordersController.assignManager("", managerId, token);

      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
      expect(response.body).toBeNull();
    }
  );

  test("Should NOT assign manager with invalid orderId format",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();

      await expect(ordersController.assignManager("12345", managerId, token)).rejects.toThrow(
        /status 500/i
      );
    }
  );

  test("Should NOT assign manager with non-existent orderId",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();
      const nonexistentOrderId = generateID();

      const response = await ordersController.assignManager(nonexistentOrderId, managerId, token);

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: `Order with id '${nonexistentOrderId}' wasn't found`,
      });
    }
  );

  test("Should NOT assign manager with empty managerId",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const response = await ordersController.assignManager(fx.orderId, "", token);

      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
      expect(response.body).toBeNull();

      await cleanupAssignFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test("Should NOT assign manager with invalid managerId format",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      await expect(ordersController.assignManager(fx.orderId, "12345", token)).rejects.toThrow(/status 500/i);

      await cleanupAssignFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test("Should NOT assign manager with non-existent managerId",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();
      const nonexistentManagerId = generateID();

      const fx = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const response = await ordersController.assignManager(
        fx.orderId,
        nonexistentManagerId,
        token
      );

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: `Manager with id '${nonexistentManagerId}' wasn't found`,
      });

      await cleanupAssignFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );
});
