import { test, expect } from "fixtures/api.fixture";
import { TAGS } from "data/tags";
import { STATUS_CODES } from "data/statusCodes";
import { ORDER_HISTORY_ACTIONS } from "data/orders/historyActions.data";
import { ORDER_STATUS } from "data/orders/statuses.data";
import { DELIVERY, LOCATION } from "data/orders/delivery.data";
import { IOrderFromResponse, IOrderHistoryItem, IOrderDelivery } from "data/types/order.types";
import { extractIds } from "utils/extractIds.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { getOrderSchema } from "data/schemas/orders/getOrder.schema";
import { orderDeliverySchema } from "data/schemas/orders/postOrderDelivery.schema";
import { orderReceiveSchema } from "data/schemas/orders/postOrdersReceive.schema";
import { faker } from "@faker-js/faker";
import { COUNTRIES } from "data/salesPortal/customers/countries";

type TestOrderHistoryItem = Omit<IOrderHistoryItem, "performer" | "changedOn">;

function prepareExpected(
  order: IOrderFromResponse,
  action: ORDER_HISTORY_ACTIONS
): TestOrderHistoryItem {
  return {
    status: order.status,
    customer: typeof order.customer === "string" ? order.customer : order.customer._id,
    products: order.products,
    total_price: order.total_price,
    delivery: order.delivery,
    action,
    assignedManager: order.assignedManager,
  };
}

function prepareActual(item: IOrderHistoryItem): TestOrderHistoryItem {
  return {
    status: item.status,
    customer: item.customer,
    products: item.products,
    total_price: item.total_price,
    delivery: item.delivery,
    action: item.action,
    assignedManager: item.assignedManager,
  };
}

async function checkHistoryItem(order: IOrderFromResponse, action: ORDER_HISTORY_ACTIONS) {
  let createdHistoryItem: IOrderHistoryItem | undefined;

  await test.step("Find created history item", () => {
    createdHistoryItem = order.history.find(item => item.action === action);
    expect(createdHistoryItem, "History item isn't found").toBeDefined();
  });

  const expected = prepareExpected(order, action);
  const actual = prepareActual(createdHistoryItem!);

  await test.step("Validate created history item (without performer)", () => {
    expect(actual, "History item is invalid").toEqual(expected);
  });
}

type DraftOrderFx = {
  token: string;
  orderId: string;
  customerId: string;
  productIds: string[];
  order: IOrderFromResponse;
};

async function createDraftOrderFx(ctx: {
  token: string;
  ordersController: any;
  customersApiService: any;
  productsApiService: any;
  productCount?: number;
}): Promise<DraftOrderFx> {
  const { token, ordersController, customersApiService, productsApiService } = ctx;
  const productCount = ctx.productCount ?? 1;

  const [customer, products] = await Promise.all([
    customersApiService.create(token),
    productsApiService.createBulk(productCount, token),
  ]);

  const productIds = extractIds(products);

  const response = await ordersController.create(
    { customer: customer._id, products: productIds },
    token
  );

  validateResponse(response, {
    status: STATUS_CODES.CREATED,
    schema: getOrderSchema,
    IsSuccess: true,
    ErrorMessage: null,
  });

  const order = response.body!.Order;

  return {
    token,
    order,
    orderId: order._id,
    customerId: customer._id,
    productIds,
  };
}

async function createDraftOrderWithDeliveryFx(ctx: {
  token: string;
  ordersController: any;
  customersApiService: any;
  productsApiService: any;
}): Promise<DraftOrderFx> {
  const fx = await createDraftOrderFx(ctx);

  const delivery: IOrderDelivery = {
    finalDate: faker.date.future().toISOString(),
    condition: DELIVERY.DELIVERY,
    address: {
      location: LOCATION.HOME,
      country: COUNTRIES.USA,
      city: faker.location.city(),
      street: faker.location.streetAddress(),
      house: faker.number.int({ min: 1, max: 100 }),
      flat: faker.number.int({ min: 1, max: 100 }),
    },
  };

  const deliveryResponse = await ctx.ordersController.updateDelivery(
    fx.orderId,
    delivery,
    fx.token
  );
  validateResponse(deliveryResponse, {
    status: STATUS_CODES.OK,
    schema: orderDeliverySchema,
    IsSuccess: true,
    ErrorMessage: null,
  });

  return {
    ...fx,
    order: deliveryResponse.body!.Order,
  };
}

async function createInProcessOrderFx(ctx: {
  token: string;
  ordersController: any;
  customersApiService: any;
  productsApiService: any;
  productCount?: number;
}): Promise<DraftOrderFx> {
  const fx0 = await createDraftOrderFx({
    token: ctx.token,
    ordersController: ctx.ordersController,
    customersApiService: ctx.customersApiService,
    productsApiService: ctx.productsApiService,
    productCount: ctx.productCount ?? 1,
  });

  const delivery: IOrderDelivery = {
    finalDate: faker.date.future().toISOString(),
    condition: DELIVERY.DELIVERY,
    address: {
      location: LOCATION.HOME,
      country: COUNTRIES.USA,
      city: faker.location.city(),
      street: faker.location.streetAddress(),
      house: faker.number.int({ min: 1, max: 100 }),
      flat: faker.number.int({ min: 1, max: 100 }),
    },
  };

  const deliveryResponse = await ctx.ordersController.updateDelivery(
    fx0.orderId,
    delivery,
    fx0.token
  );
  validateResponse(deliveryResponse, {
    status: STATUS_CODES.OK,
    schema: orderDeliverySchema,
    IsSuccess: true,
    ErrorMessage: null,
  });

  const statusResponse = await ctx.ordersController.updateStatus(
    fx0.orderId,
    ORDER_STATUS.IN_PROCESS,
    fx0.token
  );

  validateResponse(statusResponse, {
    status: STATUS_CODES.OK,
    schema: getOrderSchema,
    IsSuccess: true,
    ErrorMessage: null,
  });

  return {
    ...fx0,
    order: statusResponse.body!.Order,
  };
}

async function createCanceledOrderFx(ctx: {
  token: string;
  ordersController: any;
  customersApiService: any;
  productsApiService: any;
}): Promise<DraftOrderFx> {
  const fx = await createInProcessOrderFx(ctx);

  const statusResponse = await ctx.ordersController.updateStatus(
    fx.orderId,
    ORDER_STATUS.CANCELED,
    fx.token
  );

  validateResponse(statusResponse, {
    status: STATUS_CODES.OK,
    schema: getOrderSchema,
    IsSuccess: true,
    ErrorMessage: null,
  });

  return { ...fx, order: statusResponse.body!.Order };
}
function cleanupOrderFx(
  fx: { token: string; orderId: string; customerId: string; productIds: string[] },
  deps: { ordersApiService: any; customersApiService: any; productsApiService: any }
) {
  void (async () => {
    try {
      await deps.ordersApiService.delete(fx.orderId, fx.token);
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }

    deps.customersApiService.delete(fx.token, fx.customerId).catch(() => {});
    fx.productIds.forEach(id => deps.productsApiService.delete(fx.token, id).catch(() => {}));
  })();
}

test.describe("[API] [Sales Portal] [Orders] [History]", () => {
  test(
    "Should store a record if order has been created",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createDraftOrderFx({
        token,
        ordersController,
        customersApiService,
        productsApiService,
      });

      await checkHistoryItem(fx.order, ORDER_HISTORY_ACTIONS.CREATED);

      cleanupOrderFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test(
    "Should store a record if customer has been changed",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createDraftOrderFx({
        token,
        ordersController,
        customersApiService,
        productsApiService,
      });

      const newCustomer = await customersApiService.create(token);

      const updateResponse = await ordersController.update(
        fx.orderId,
        { customer: newCustomer._id, products: fx.productIds },
        token
      );

      validateResponse(updateResponse, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updatedOrder = updateResponse.body!.Order;
      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.CUSTOMER_CHANGED);

      cleanupOrderFx(fx, { ordersApiService, customersApiService, productsApiService });
      customersApiService.delete(token, newCustomer._id).catch(() => {});
    }
  );

  test(
    "Should store a record if product has been added",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createDraftOrderFx({
        token,
        ordersController,
        customersApiService,
        productsApiService,
      });

      const newProduct = await productsApiService.create(token);

      const updatedBody = {
        products: [...fx.productIds, newProduct._id],
        customer: fx.customerId,
      };

      const updateResponse = await ordersController.update(fx.orderId, updatedBody, token);

      validateResponse(updateResponse, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updatedOrder = updateResponse.body!.Order;
      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED);

      cleanupOrderFx(fx, { ordersApiService, customersApiService, productsApiService });
      productsApiService.delete(token, newProduct._id).catch(() => {});
    }
  );

  test(
    "Should store a record if product has been deleted",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createDraftOrderFx({
        token,
        ordersController,
        customersApiService,
        productsApiService,
        productCount: 2,
      });

      const keepFirstId = fx.productIds[0]!;
      const updateResponse = await ordersController.update(
        fx.orderId,
        { customer: fx.customerId, products: [keepFirstId] },
        token
      );

      validateResponse(updateResponse, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updatedOrder = updateResponse.body!.Order;
      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED);

      cleanupOrderFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test(
    "Should store a record if order moved to IN_PROCESS",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createDraftOrderWithDeliveryFx({
        token,
        ordersController,
        customersApiService,
        productsApiService,
      });

      const statusResponse = await ordersController.updateStatus(
        fx.orderId,
        ORDER_STATUS.IN_PROCESS,
        token
      );

      validateResponse(statusResponse, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const inProcessOrder = statusResponse.body!.Order;
      await checkHistoryItem(inProcessOrder, ORDER_HISTORY_ACTIONS.PROCESSED);

      cleanupOrderFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test(
    "Should store a record if delivery added",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createDraftOrderFx({
        token,
        ordersController,
        customersApiService,
        productsApiService,
      });

      const delivery: IOrderDelivery = {
        finalDate: faker.date.future().toISOString(),
        condition: DELIVERY.DELIVERY,
        address: {
          location: LOCATION.HOME,
          country: COUNTRIES.USA,
          city: faker.location.city(),
          street: faker.location.streetAddress(),
          house: faker.number.int({ min: 1, max: 100 }),
          flat: faker.number.int({ min: 1, max: 100 }),
        },
      };

      const deliveryResponse = await ordersController.updateDelivery(fx.orderId, delivery, token);
      validateResponse(deliveryResponse, {
        status: STATUS_CODES.OK,
        schema: orderDeliverySchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updatedOrder = deliveryResponse.body!.Order;
      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.DELIVERY_SCHEDULED);

      cleanupOrderFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test(
    "Should store a record if delivery edited",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createDraftOrderWithDeliveryFx({
        token,
        ordersController,
        customersApiService,
        productsApiService,
      });

      const delivery: IOrderDelivery = {
        finalDate: faker.date.future().toISOString(),
        condition: DELIVERY.PICKUP,
        address: {
          location: LOCATION.OTHER,
          country: COUNTRIES.GREAT_BRITAIN,
          city: faker.location.city(),
          street: faker.location.streetAddress(),
          house: faker.number.int({ min: 1, max: 100 }),
          flat: faker.number.int({ min: 1, max: 100 }),
        },
      };

      const deliveryResponse = await ordersController.updateDelivery(fx.orderId, delivery, token);

      validateResponse(deliveryResponse, {
        status: STATUS_CODES.OK,
        schema: orderDeliverySchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updatedOrder = deliveryResponse.body!.Order;
      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.DELIVERY_EDITED);

      cleanupOrderFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test(
    "Should store a record if partially received",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createInProcessOrderFx({
        token,
        ordersController,
        customersApiService,
        productsApiService,
        productCount: 2,
      });

      const firstProductId = fx.productIds[0]!;
      const receiveResponse = await ordersController.receiveProducts(
        fx.orderId,
        [firstProductId],
        token
      );

      validateResponse(receiveResponse, {
        status: STATUS_CODES.OK,
        schema: orderReceiveSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updatedOrder = receiveResponse.body!.Order;
      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.RECEIVED);

      cleanupOrderFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test(
    "Should store a record if fully received",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createInProcessOrderFx({
        token,
        ordersController,
        customersApiService,
        productsApiService,
        productCount: 2,
      });

      const receiveResponse = await ordersController.receiveProducts(
        fx.orderId,
        fx.productIds,
        token
      );

      validateResponse(receiveResponse, {
        status: STATUS_CODES.OK,
        schema: orderReceiveSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updatedOrder = receiveResponse.body!.Order;
      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.RECEIVED_ALL);

      cleanupOrderFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test(
    "Should store a record if canceled",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createInProcessOrderFx({
        token,
        ordersController,
        customersApiService,
        productsApiService,
      });

      const statusResponse = await ordersController.updateStatus(
        fx.orderId,
        ORDER_STATUS.CANCELED,
        token
      );

      validateResponse(statusResponse, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updatedOrder = statusResponse.body!.Order;
      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.CANCELED);

      cleanupOrderFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test(
    "Should store a record if reopened",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({
      loginApiService,
      ordersController,
      ordersApiService,
      customersApiService,
      productsApiService,
    }) => {
      const token = await loginApiService.loginAsAdmin();

      const fx = await createCanceledOrderFx({
        token,
        ordersController,
        customersApiService,
        productsApiService,
      });

      const statusResponse = await ordersController.updateStatus(
        fx.orderId,
        ORDER_STATUS.DRAFT,
        token
      );

      validateResponse(statusResponse, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const updatedOrder = statusResponse.body!.Order;
      await checkHistoryItem(updatedOrder, ORDER_HISTORY_ACTIONS.REOPENED);

      cleanupOrderFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );
});
