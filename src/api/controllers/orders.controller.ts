import { OrdersApi } from "api/api/orders.api";
import { IOrderDelivery, IOrderData, IOrderRequestParams } from "data/types/order.types";
import { ORDER_STATUS } from "data/orders/statuses.data";
import { logStep } from "utils/report/logStep.utils";

export class OrdersAPIController {
  constructor(private ordersApi: OrdersApi) {}

  @logStep("Create order via API")
  async create(data: IOrderData, token: string) {
    return await this.ordersApi.create(data, token);
  }

  @logStep("Get filtered and sorted list of orders via API")
  async getFilteredOrders(token: string, params?: Partial<IOrderRequestParams>) {
    return await this.ordersApi.getFiltered(token, params);
  }

  @logStep("Get order by ID via API")
  async getByID(id: string, token: string) {
    return await this.ordersApi.getById(id, token);
  }

  @logStep("Update order via API")
  async update(id: string, data: IOrderData, token: string) {
    return await this.ordersApi.update(id, data, token);
  }

  @logStep("Delete order via API")
  async delete(id: string, token: string) {
    return await this.ordersApi.delete(id, token);
  }

  @logStep("Assign manager to order")
  async assignManager(orderId: string, managerId: string, token: string) {
    return await this.ordersApi.assignManager(orderId, managerId, token);
  }

  @logStep("Unassign manager from order")
  async unassignManager(orderId: string, token: string) {
    return await this.ordersApi.unassignManager(orderId, token);
  }

  @logStep("Add comment to order via API")
  async addComment(id: string, text: string, token: string) {
    return await this.ordersApi.addComment(id, text, token);
  }

  @logStep("Delete order comment via API")
  async deleteComment(orderId: string, commentId: string, token: string) {
    return await this.ordersApi.deleteComment(orderId, commentId, token);
  }

  @logStep("Update order delivery via API")
  async updateDelivery(id: string, delivery: IOrderDelivery, token: string) {
    return await this.ordersApi.updateDelivery(id, delivery, token);
  }

  @logStep("Receive products for order via API")
  async receiveProducts(id: string, productIds: string[], token: string) {
    return await this.ordersApi.receiveProducts(id, productIds, token);
  }

  @logStep("Update order status via API")
  async updateStatus(id: string, status: ORDER_STATUS, token: string) {
    return await this.ordersApi.updateStatus(id, status, token);
  }
}
