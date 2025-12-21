import { faker } from "@faker-js/faker";
import { IOrder, IOrderProduct } from "data/types/order.types";
import { generateCustomerFromResponse } from "data/salesPortal/customers/generateCustomerData";

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
  const products = Array.from({ length: productsCount }, generateOrderProductData);

  const total_price = products.reduce((sum, product) => sum + product.price * product.amount, 0);

  const customer = generateCustomerFromResponse({ _id: customerId });

  return {
    _id: faker.database.mongodbObjectId(),
    status: faker.helpers.arrayElement([
      "Draft",
      "Partially Received",
      "Canceled",
      "In Process",
      "Received",
    ]),
    customer, // ✅ customer теперь ICustomerFromResponse
    products,
    delivery: null,
    total_price,
    createdOn: faker.date.recent().toISOString(),
    comments: [],
    history: [],
    assignedManager: null,
  };
}

export function generateCustomerOrdersResponse(customerId: string, count = 2) {
  return {
    Orders: Array.from({ length: count }, () => generateOrderData(customerId)),
    IsSuccess: true,
    ErrorMessage: null,
  };
}
