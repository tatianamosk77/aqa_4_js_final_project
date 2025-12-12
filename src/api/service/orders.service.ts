import { OrdersApi } from 'api/api/orders.api';
import { IOrderData, IOrderDelivery } from 'data/types/order.types';
import { IOrderRequestParams } from 'data/types/order.types';
import { logStep } from 'utils/report/logStep.utils';
import { validateResponse } from 'utils/validation/validateResponse.utils';
import { STATUS_CODES } from 'data/statusCodes';
import { ordersListSchema } from 'data/schemas/orders/order.schema';
import { createOrderSchema } from 'data/schemas/orders/create.shema';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { getOrderSchema } from 'data/schemas/orders/getOrder.schema';
import { updateOrderResponseSchema } from 'data/schemas/orders/updateOrder.schema';

export class OrdersApiService {
  constructor(private ordersApi: OrdersApi) {}

  @logStep('Create order')
  async create(orderData: IOrderData, token: string) {
    const response = await this.ordersApi.create(orderData, token);
    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createOrderSchema,
    });
    return response.body.Order;
  }

  @logStep('Get order')
  async getById(token: string, orderId: string) {
    const response = await this.ordersApi.getById(orderId, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getOrderSchema,
    });
    return response.body.Order;
  }

  @logStep('Update order')
  async update(token: string, orderId: string, orderData: IOrderData) {
    const response = await this.ordersApi.update(orderId, orderData, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: updateOrderResponseSchema,
    });
    return response.body.Order;
  }

  @logStep('Delete order')
  async delete(token: string, orderId: string) {
    const response = await this.ordersApi.delete(orderId, token);
    validateResponse(response, {
      status: STATUS_CODES.DELETED,
      IsSuccess: true,
      ErrorMessage: null,
    });
  }

  @logStep('Get filtered orders')
  async getFiltered(token: string, params?: IOrderRequestParams) {
    const response = await this.ordersApi.getFiltered(token, params);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: ordersListSchema,
    });
    return response.body;
  }

  @logStep('Assign manager to order')
  async assignManager(token: string, orderId: string, managerId: string) {
    const response = await this.ordersApi.assignManager(orderId, managerId, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: updateOrderResponseSchema,
    });
  }

  @logStep('Unassign manager from order')
  async unassignManager(token: string, orderId: string) {
    const response = await this.ordersApi.unassignManager(orderId, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: updateOrderResponseSchema,
    });
  }

  @logStep('Add comment to order')
  async addComment(token: string, orderId: string, comment: string) {
    const response = await this.ordersApi.addComment(orderId, comment, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: updateOrderResponseSchema,
    });
  }

  @logStep('Delete comment from order')
  async deleteComment(orderId: string, token: string, commentId: string) {
    const response = await this.ordersApi.deleteComment(orderId, commentId, token);
    validateResponse(response, {
      status: STATUS_CODES.DELETED,
      IsSuccess: true,
      ErrorMessage: null,
    });
  }

  @logStep('Update delivery')
  async updateDelivery(token: string, orderId: string, delivery: IOrderDelivery) {
    const response = await this.ordersApi.updateDelivery(orderId, delivery, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: updateOrderResponseSchema,
    });
  }

  @logStep('Receive order')
  async receive(token: string, orderId: string, productIds: string[]) {
    const response = await this.ordersApi.receiveProducts(orderId, productIds, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: updateOrderResponseSchema,
    });
  }

  @logStep('Update order status')
  async updateStatus(token: string, orderId: string, status: ORDER_STATUS) {
    const response = await this.ordersApi.updateStatus(orderId, status, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: updateOrderResponseSchema,
    });
  }
}
