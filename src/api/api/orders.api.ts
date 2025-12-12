import { IApiClient } from 'api/apiClients/types';
import { apiConfig } from 'config/apiConfig';
import { IRequestOptions } from 'data/types/core.types';
import {
  IOrderData,
  IOrderFilteredResponse,
  IOrderRequestParams,
  IOrderResponse,
} from 'data/types/order.types';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import { IOrderDelivery } from 'data/types/order.types';
import { convertRequestParams } from 'utils/queryParams.utils';
import { logStep } from 'utils/report/logStep.utils';

export class OrdersApi {
  constructor(private apiClient: IApiClient) {}

  @logStep('POST /api/orders')
  async create(order: IOrderData, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orders,
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: order,
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  @logStep('GET /api/orders/{id}')
  async getById(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderById(id),
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  @logStep('GET /api/orders')
  async getFiltered(token: string, params?: Partial<IOrderRequestParams>) {
    let queryString = '';
    if (params) {
      const filteredParams: Record<string, string | number | string[]> = {};
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          filteredParams[key] = value as string | number | string[];
        }
      }
      queryString =
        Object.keys(filteredParams).length > 0 ? convertRequestParams(filteredParams) : '';
    }

    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orders + queryString,
      method: 'get',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<IOrderFilteredResponse>(options);
  }

  @logStep('PUT /api/orders/{id}')
  async update(id: string, order: IOrderData, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderById(id),
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: order,
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  @logStep('DELETE /api/orders/{id}')
  async delete(id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderById(id),
      method: 'delete',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<null>(options);
  }

  @logStep('PUT /api/orders/{id}/assign-manager/{managerId}')
  async assignManager(orderId: string, managerId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderAssignManager(orderId, managerId),
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  @logStep('PUT /api/orders/{id}/unassign-manager')
  async unassignManager(orderId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderUnassignManager(orderId),
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  @logStep('POST /api/orders/{id}/comments')
  async addComment(id: string, text: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderComment(id),
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: { comment: text },
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  @logStep('DELETE /api/orders/{orderId}/comments/{commentId}')
  async deleteComment(orderId: string, commentId: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderCommentById(orderId, commentId),
      method: 'delete',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  @logStep('POST /api/orders/{id}/delivery')
  async updateDelivery(id: string, delivery: IOrderDelivery, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderDelivery(id),
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: delivery,
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  @logStep('POST /api/orders/{id}/receive')
  async receiveProducts(id: string, productIds: string[], token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderReceive(id),
      method: 'post',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: { products: productIds },
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }

  @logStep('PUT /api/orders/{id}/status')
  async updateStatus(id: string, status: ORDER_STATUS, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderStatus(id),
      method: 'put',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      data: { status },
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }
}
