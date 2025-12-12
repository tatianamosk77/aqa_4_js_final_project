import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { errorSchema } from "data/schemas/core.schema";
import { getOrderSchema } from "data/schemas/orders/getOrder.schema";
import { orderCommentSchema } from "data/schemas/orders/addOrderComment.schema";
import { generateID } from "utils/generateID.utils";

test.describe("[API] [Sales Portal] [Orders] [Comments] [Delete]", () => {
  test.describe.configure({ mode: "parallel" });

  async function createOrderWithCommentFx(deps: {
    token: string;
    customersApiService: any;
    productsApiService: any;
    ordersApiService: any;
    ordersController: any;
  }) {
    const { token, customersApiService, productsApiService, ordersApiService, ordersController } =
      deps;

    const [customer, product] = await Promise.all([
      customersApiService.create(token),
      productsApiService.create(token),
    ]);

    const order = await ordersApiService.create(
      { customer: customer._id, products: [product._id] },
      token
    );

    const addCommentResp = await ordersController.addComment(order._id, "autotest comment", token);

    validateResponse(addCommentResp, {
      status: STATUS_CODES.OK,
      schema: orderCommentSchema,
      IsSuccess: true,
      ErrorMessage: null,
    });

    const createdOrder = addCommentResp.body!.Order;
    const commentId = createdOrder.comments?.[0]?._id;
    if (!commentId) throw new Error("commentId was not created");

    return {
      token,
      orderId: createdOrder._id as string,
      customerId:
        typeof createdOrder.customer === "string"
          ? createdOrder.customer
          : createdOrder.customer._id,
      productId: createdOrder.products?.[0]?._id as string,
      commentId: commentId as string,
    };
  }

  async function cleanupFx(
    fx: { token: string; orderId: string; customerId: string; productId: string },
    deps: { ordersApiService: any; customersApiService: any; productsApiService: any }
  ) {
    await deps.ordersApiService.delete(fx.orderId, fx.token).catch(() => {});
    await deps.customersApiService.delete(fx.token, fx.customerId).catch(() => {});
    deps.productsApiService.delete(fx.token, fx.productId).catch(() => {});
  }

  test("Should delete a comment with all valid data (token, orderId, commentId)",
    { tag: [TAGS.API, TAGS.SMOKE, TAGS.REGRESSION] },
    async ({ loginApiService, customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();
      const fx = await createOrderWithCommentFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
        ordersController,
      });

      const deleteResp = await ordersController.deleteComment(fx.orderId, fx.commentId, token);

      validateResponse(deleteResp, {
        status: STATUS_CODES.DELETED,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const getResp = await ordersController.getByID(fx.orderId, token);

      validateResponse(getResp, {
        status: STATUS_CODES.OK,
        schema: getOrderSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      expect(getResp.body!.Order.comments ?? []).toHaveLength(0);

      await cleanupFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test("Should NOT delete a comment with orderId invalid (non existing)",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();
      const fx = await createOrderWithCommentFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
        ordersController,
      });

      const invalidOrderId = generateID();
      const deleteResp = await ordersController.deleteComment(invalidOrderId, fx.commentId, token);

      validateResponse(deleteResp, {
        status: STATUS_CODES.NOT_FOUND,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: `Order with id '${invalidOrderId}' wasn't found`,
      });

      await cleanupFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );

  test("Should NOT delete a comment with commentId invalid",
    { tag: [TAGS.API, TAGS.REGRESSION] },
    async ({ loginApiService, customersApiService, productsApiService, ordersApiService, ordersController }) => {
      const token = await loginApiService.loginAsAdmin();
      const fx = await createOrderWithCommentFx({
        token,
        customersApiService,
        productsApiService,
        ordersApiService,
        ordersController,
      });

      const invalidCommentId = generateID();
      const deleteResp = await ordersController.deleteComment(fx.orderId, invalidCommentId, token);

      validateResponse(deleteResp, {
        status: STATUS_CODES.BAD_REQUEST,
        schema: errorSchema,
        IsSuccess: false,
        ErrorMessage: "Comment was not found",
      });

      await cleanupFx(fx, { ordersApiService, customersApiService, productsApiService });
    }
  );
});
