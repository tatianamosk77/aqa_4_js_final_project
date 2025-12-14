import { test, expect } from 'fixtures/business.fixture';
import { TAGS } from 'data/tags';
import { IOrderData } from 'data/types/order.types';
import { ERROR_MESSAGES } from 'data/salesPortal/errorMessages';
import { validateResponse } from 'utils/validation/validateResponse.utils';
import { STATUS_CODES } from 'data/statusCodes';

test.describe('[API] [Sales Portal] [Customers]', () => {
  const createdCustomerIds: string[] = [];
  const createdOrderIds: string[] = [];
  let token = '';

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ customersApiService, ordersApiService }) => {
    // Удаляем все созданные заказы
    for (const orderId of createdOrderIds) {
      await ordersApiService.delete(orderId, token).catch(() => {});
    }
    createdOrderIds.length = 0;

    // Удаляем всех созданных клиентов
    for (const customerId of createdCustomerIds) {
      await customersApiService.delete(token, customerId).catch(() => {});
    }
    createdCustomerIds.length = 0;
  });

  test('Should get order for customer with one order', 
    { tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API] },
    async ({ customersApiService, productsApiService, ordersApiService }) => {

      const customer = await customersApiService.create(token);
      createdCustomerIds.push(customer._id);

      const product = await productsApiService.create(token);

      const orderData: IOrderData = {
        customer: customer._id,
        products: [product._id],
      };

      const createdOrder = await ordersApiService.create(orderData, token);
      createdOrderIds.push(createdOrder._id);

      const response = await customersApiService.getCustomerOrders(token, customer._id);

      expect(Array.isArray(response.Orders)).toBe(true);
      expect(response.Orders.length).toBe(1);

      const order = response.Orders[0];
      expect(order).toHaveProperty('_id');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('products');
      expect(order).toHaveProperty('createdOn');
      expect(order!.customer).toBe(customer._id);

      // Проверка total_price безопасно
      expect(typeof order!.total_price).toBe('number');
      expect(order!.total_price).toBeGreaterThanOrEqual(0);

      // Логируем для отладки
      console.log('Products:', order!.products);
      console.log('Returned total_price:', order!.total_price);
  });

  test('Should get orders for customer with multiple orders',
    { tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API] },
    async ({ customersApiService, productsApiService, ordersApiService }) => {

      const customer = await customersApiService.create(token);
      createdCustomerIds.push(customer._id);

      const product = await productsApiService.create(token);

      for (let i = 0; i < 3; i++) {
        const createdOrder = await ordersApiService.create({
          customer: customer._id,
          products: [product._id],
        }, token);
        createdOrderIds.push(createdOrder._id);
      }

      const response = await customersApiService.getCustomerOrders(token, customer._id);

      expect(Array.isArray(response.Orders)).toBe(true);
      expect(response.Orders).toHaveLength(3);
  });

  test('Should return empty orders array for new customer', 
    { tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API] },
    async ({ customersApiService }) => {

      const customer = await customersApiService.create(token);
      createdCustomerIds.push(customer._id);

      const response = await customersApiService.getCustomerOrders(token, customer._id);

      expect(Array.isArray(response.Orders)).toBe(true);
      expect(response.Orders).toHaveLength(0);
  });

  test('Should fail with invalid token', async ({ customersApi }) => {
  const response = await customersApi.getCustomerOrders('someId', 'invalidToken');
  validateResponse(response, {
    status: STATUS_CODES.UNAUTHORIZED,
    IsSuccess: false,
    ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
  });
});

test('Should fail for non-existent customer', async ({ customersApi }) => {
  const nonExistentId = '693f135c1c508c665ec860f6';
  const response = await customersApi.getCustomerOrders(nonExistentId, token);
  validateResponse(response, {
    status: STATUS_CODES.NOT_FOUND,
    IsSuccess: false,
    ErrorMessage: ERROR_MESSAGES.CUSTOMER_NOT_FOUND_WITH_ID(nonExistentId),
  });
});
});
 