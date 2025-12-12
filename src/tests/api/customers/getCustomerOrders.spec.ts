import { test, expect } from 'fixtures/business.fixture';
import { TAGS } from 'data/tags';
import { customerOrdersSchema } from 'data/schemas/orders/order.schema';
import { validateJsonSchema } from 'utils/validation/validateSchema.utils';
import { ICustomerOrdersResponse } from 'data/types/customer.types';

test.describe('[API] [Sales Portal] [Customers]', () => {
  const createdCustomerIds: string[] = [];
  let token = '';

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ customersApiService }) => {
    if (createdCustomerIds.length) {
      for (const id of createdCustomerIds) {
        await customersApiService.delete(token, id);
      }
      createdCustomerIds.length = 0;
    }
  });

  test(
    'Get Customer Orders - api call and schema validation',
    {
      tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
    },async ({ customersApiService }) => {
    const createResponse = await customersApiService.create(token);
    const customerId = createResponse._id;
    createdCustomerIds.push(customerId);

//тут добавить новый ордер для кастомера
// const order = await ordersApiService.createOrder(token, customerId);

    const response = await customersApiService.getCustomerOrders(token, customerId);

    expect(response).toBeDefined();
    expect(response.IsSuccess).toBe(true);
    expect(response.Orders).toBeInstanceOf(Array);

    validateJsonSchema(customerOrdersSchema, response as ICustomerOrdersResponse);

    if (response.Orders.length === 0) {
    console.log("The customer has no orders");
    } else {
    response.Orders.forEach(order => {
        expect(order.customer).toBe(customerId);
        expect(order).toHaveProperty('_id');
        expect(order).toHaveProperty('status');
        expect(order).toHaveProperty('products');
        expect(order).toHaveProperty('total_price');
        expect(order).toHaveProperty('createdOn');

        if (order.products.length > 0) {
          const calculatedTotal = order.products.reduce(
            (sum, product) => sum + product.price * product.amount,
            0
          );
          expect(order.total_price).toBe(calculatedTotal);
        }
      });
    }
  }
  );
});
