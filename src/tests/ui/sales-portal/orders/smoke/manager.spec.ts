import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { TAGS } from "data/tags";
import { test, expect } from "fixtures/business.fixture";


test.describe("[Smoke][Sales Portal][Orders] Manager", () => {
  let token: string;
  let customerName: string;
  let orderId: string;


  test.beforeAll(async ({ loginApiService, customersApiService }) => {
    const { token: authToken } = await loginApiService.loginAsAdminWithUser();
    token = authToken;


    const customer = await customersApiService.create(token, generateCustomerData());
    customerName = customer.name;
  });


  test.afterEach(async ({ ordersApiService }) => {
    if (orderId) await ordersApiService.delete(orderId, token);
  });

  test("Add manager to order", 
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.UI] },
    async ({ ordersListUIService,
      orderDetailsPage,
      ordersListPage,
      addNewOrderUIService,
      assignManagerModal 
    }) => {
      await ordersListUIService.openOrdersList();
      await ordersListUIService.createNewOrder();
      const response = await addNewOrderUIService.createMinimalOrderSafe(customerName);
      orderId = response.order._id;

      await ordersListUIService.openOrderDetails(orderId);
      await orderDetailsPage.waitForOpened();
      await orderDetailsPage.clickToSelectManager();
      const selectedManagerName = await assignManagerModal.chooseRandomManager();
      await expect(assignManagerModal.saveButton).toBeEnabled();
      await assignManagerModal.clickEdit();
      await orderDetailsPage.waitForOpened();
      
      const assignedManagerName = await orderDetailsPage.assignedManagerLink.innerText();
      expect(assignedManagerName).toBe(selectedManagerName);
      await ordersListUIService.openOrdersList();
      await ordersListPage.waitForTableToLoad();

      const orderRow = ordersListPage.getOrderRowByNumber(orderId);
      const assignedManagerCell = orderRow.locator("td").nth(5);
      await expect(assignedManagerCell).toHaveText(selectedManagerName);
  });
}); 