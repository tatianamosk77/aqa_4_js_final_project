import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { TAGS } from "data/tags";
import { test, expect } from "fixtures/business.fixture";

test.describe("[Smoke][Sales Portal][Orders] Create order", () => {
  let token: string;
  let productId: string;
  let customerId: string;
  let customerName: string;
  let orderId: string;

  test.beforeAll(async ({ loginApiService, productsApiService, customersApiService }) => {
    const { token: authToken } = await loginApiService.loginAsAdminWithUser();
    token = authToken;

    const product = await productsApiService.create(token);
    productId = product._id;

    const customer = await customersApiService.create(token, generateCustomerData());
    customerId = customer._id;
    customerName = customer.name;
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderId) {
      await ordersApiService.delete(orderId, token);
      orderId = "";
    }
  });

  test.afterAll(async ({ customersApiService, productsApiService }) => {
    if (customerId) {
      await customersApiService.delete(token, customerId);
      customerId = "";
    }
    if (productId) {
      await productsApiService.delete(token, productId);
      productId = "";
    }
  });

  test("Create order", 
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.UI] }, 
    async ({ ordersListUIService, addNewOrderUIService }) => {
      await ordersListUIService.open();
      await ordersListUIService.openAddNewOrdersPage();
      const response = await addNewOrderUIService.createMinimalOrder(customerName);
      orderId = response.order._id;

      await ordersListUIService.assertCustomerRowVisibleInTable(orderId, { visible: true });
  });
});