import { OrdersApi } from "api/api/orders.api";
import { createOrderSchema } from "data/schemas/orders/create.shema";
import { getOrderSchema } from "data/schemas/orders/getOrder.schema";
import { orderDeliverySchema } from "data/schemas/orders/postOrderDelivery.schema";
import { orderReceiveSchema } from "data/schemas/orders/postOrdersReceive.schema";
import { STATUS_CODES } from "data/statusCodes";
import {
  IOrderData,
  IOrderDelivery,
  IOrderFilteredResponse,
  IOrderRequestParams,
} from "data/types/order.types";
import { ORDER_STATUS } from "data/orders/statuses.data";
import { logStep } from "utils/report/logStep.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class OrdersApiService {
  constructor(private ordersApi: OrdersApi) {}

  @logStep("Create order via API")
  async create(data: IOrderData, token: string) {
    const response = await this.ordersApi.create(data, token);

    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });

    return response.body!.Order;
  }

  @logStep("Get order by ID via API")
  async getById(id: string, token: string) {
    const response = await this.ordersApi.getById(id, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getOrderSchema,
    });

    return response.body!.Order;
  }

  @logStep("Get filtered and sorted list of orders via API")
  async getFiltered(token: string, params?: Partial<IOrderRequestParams>) {
    const response = await this.ordersApi.getFiltered(token, params);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
    });

    return response.body as IOrderFilteredResponse;
  }

  @logStep("Update order via API")
  async update(id: string, data: IOrderData, token: string) {
    const response = await this.ordersApi.update(id, data, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getOrderSchema,
    });

    return response.body!.Order;
  }

  @logStep("Delete order via API")
  async delete(id: string, token: string): Promise<void> {
    const response = await this.ordersApi.delete(id, token);

    validateResponse(response, {
      status: STATUS_CODES.DELETED,
    });
  }

  @logStep("Assign manager to order via API")
  async assignManager(orderId: string, managerId: string, token: string) {
    const response = await this.ordersApi.assignManager(orderId, managerId, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getOrderSchema,
    });

    return response.body!.Order;
  }

  @logStep("Unassign manager from order via API")
  async unassignManager(orderId: string, token: string) {
    const response = await this.ordersApi.unassignManager(orderId, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getOrderSchema,
    });

    return response.body!.Order;
  }

  @logStep("Add comment to order via API")
  async addComment(id: string, text: string, token: string) {
    const response = await this.ordersApi.addComment(id, text, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getOrderSchema,
    });

    return response.body!.Order;
  }

  @logStep("Delete order comment via API")
  async deleteComment(orderId: string, commentId: string, token: string) {
    const response = await this.ordersApi.deleteComment(orderId, commentId, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getOrderSchema,
    });

    return response.body!.Order;
  }

  @logStep("Update order delivery via API")
  async updateDelivery(id: string, delivery: IOrderDelivery, token: string) {
    const response = await this.ordersApi.updateDelivery(id, delivery, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: orderDeliverySchema,
    });

    return response.body!.Order;
  }

  @logStep("Receive products for order via API")
  async receiveProducts(id: string, productIds: string[], token: string) {
    const response = await this.ordersApi.receiveProducts(id, productIds, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: orderReceiveSchema,
    });

    return response.body!.Order;
  }

  @logStep("Update order status via API")
  async updateStatus(id: string, status: ORDER_STATUS, token: string) {
    const response = await this.ordersApi.updateStatus(id, status, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getOrderSchema,
    });

    return response.body!.Order;
  }

  @logStep("Setup test notifications: Create order, assign manager, add comment")
  async setupTestNotifications(
    token: string,
    orderData: IOrderData,
    managerId: string,
    commentText: string = "Test comment for notification"
  ): Promise<string> {
    try {
      const createdOrder = await this.create(orderData, token);
      const orderId = createdOrder._id;

      await this.assignManager(token, orderId, managerId);

      await this.addComment(token, orderId, commentText);

      return orderId;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Setup of test notifications failed: ${error.message}`);
      } else {
        throw new Error(`Setup of test notifications failed: ${String(error)}`);
      }
    }
  }
}
