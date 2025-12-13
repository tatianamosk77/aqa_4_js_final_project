import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { getOrderSchema } from "data/schemas/orders/getOrder.schema";
import { errorSchema } from "data/schemas/core.schema";
import { generateID } from "utils/generateID.utils";
import { ORDER_HISTORY_ACTIONS } from "data/salesPortal/orders/historyActions.data";

test.describe("[API] [Sales Portal] [Orders] [Unassign Manager]", () => {
  test.describe.configure({ mode: "parallel" });

  type UnassignFx = {
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
  }): Promise<UnassignFx> {
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

  async function cleanupUnassignFx(
    fx: UnassignFx,
    deps: { ordersApiService: any; customersApiService: any; productsApiService: any }
  ) {
    const { token, orderId, customerId, productId } = fx;

    await deps.ordersApiService.delete(orderId, token).catch(() => {});
    await deps.customersApiService.delete(token, customerId).catch(() => {});
    deps.productsApiService.delete(token, productId).catch(() => {});
  }

  test(
    "Should unassign manager with valid orderId and token",
    { tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const [token, admin] = await Promise.all([
        loginApiService.loginAsAdmin(),
        loginApiService.loginAsAdminWithUser(),
      ]);

      const managerId = admin.userId;
      if (!managerId) throw new Error("No managerId retrieved from loginAsAdminWithUser");

      const fx = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      await ordersController.assignManager(fx.orderId, managerId, token);

      const response = await ordersController.unassignManager(fx.orderId, token);

      validateResponse(response, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updated = response.body!.Order;

      expect(updated._id).toBe(fx.orderId);
      expect.soft(updated.assignedManager).toBeNull();

      const actions = updated.history?.map(h => h.action) ?? [];
      if ((ORDER_HISTORY_ACTIONS as any).MANAGER_UNASSIGNED) {
        expect.soft(actions).toContain((ORDER_HISTORY_ACTIONS as any).MANAGER_UNASSIGNED);
      }

      const getResponse = await ordersController.getByID(fx.orderId, token);
      validateResponse(getResponse, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      expect.soft(getResponse.body!.Order.assignedManager).toBeNull();

      await cleanupUnassignFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test(
    "Should NOT unassign manager with invalid token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const invalidToken = "Invalid access token";

      const [token, admin] = await Promise.all([
        loginApiService.loginAsAdmin(),
        loginApiService.loginAsAdminWithUser(),
      ]);

      const managerId = admin.userId;
      if (!managerId) throw new Error("No managerId retrieved from loginAsAdminWithUser");

      const fx = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      await ordersController.assignManager(fx.orderId, managerId, token);

      const response = await ordersController.unassignManager(fx.orderId, invalidToken);

      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Invalid access token",
      });

      await cleanupUnassignFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test(
    "Should NOT unassign manager without token",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const emptyToken = "";

      const [token, admin] = await Promise.all([
        loginApiService.loginAsAdmin(),
        loginApiService.loginAsAdminWithUser(),
      ]);

      const managerId = admin.userId;
      if (!managerId) throw new Error("No managerId retrieved from loginAsAdminWithUser");

      const fx = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      await ordersController.assignManager(fx.orderId, managerId, token);

      const response = await ordersController.unassignManager(fx.orderId, emptyToken);

      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Not authorized",
      });

      await cleanupUnassignFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test(
    "Should NOT unassign manager with invalid orderId format",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();

      await expect(ordersController.unassignManager("12345", token)).rejects.toThrow(/status 500/i);
    }
  );

  test(
    "Should NOT unassign manager with non-existent orderId",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();
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
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createOrderFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
      });

      const response = await ordersController.unassignManager(fx.orderId, token);

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

      await cleanupUnassignFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );
});
