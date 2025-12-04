import { faker } from '@faker-js/faker';
import { IOrder, IOrderProduct } from 'data/types/order.types';

export function generateOrderProductData(): IOrderProduct {
  return {
    _id: faker.database.mongodbObjectId(),
    name: faker.commerce.productName(),
    amount: faker.number.int({ min: 1, max: 100 }),
    price: faker.number.int({ min: 10, max: 1000 }),
    manufacturer: faker.company.name(),
    notes: faker.lorem.sentence(),
    received: faker.datatype.boolean(),
  };
}

export function generateOrderData(customerId: string): IOrder {
  const productsCount = faker.number.int({ min: 1, max: 5 });
  const products = Array.from({ length: productsCount }, () => generateOrderProductData());

  const total_price = products.reduce((sum, product) => {
    return sum + product.price * product.amount;
  }, 0);

  return {
    _id: faker.database.mongodbObjectId(),
    status: faker.helpers.arrayElement(['Draft']),
    customer: customerId,
    products: products,
    delivery: null,
    total_price: total_price,
    createdOn: faker.date.recent().toISOString(),
    comments: [],
    history: [],
    assignedManager: null,
  };
}

export function generateCustomerOrdersResponse(customerId: string, count: number = 2) {
  return {
    Orders: Array.from({ length: count }, () => generateOrderData(customerId)),
    IsSuccess: true,
    ErrorMessage: null,
  };
}
