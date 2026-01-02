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
    async ({ ordersListUIService, orderDetailsPage, ordersListPage, addNewOrderUIService }) => {
      await ordersListUIService.open();
      await ordersListUIService.openAddNewOrdersPage();
      const response = await addNewOrderUIService.createMinimalOrder(customerName);
      orderId = response.order._id;

      await ordersListUIService.openDetailsOrdersPage(orderId);
      await orderDetailsPage.waitForOpened();
      const assignManagerModal = await orderDetailsPage.openAssignManagerModal();
      const selectedManagerName = await assignManagerModal.chooseRandomManager();
      await expect(assignManagerModal.saveButton).toBeEnabled();
      await assignManagerModal.clickSave();
      await orderDetailsPage.waitForOpened();

      const assignedManagerLink = orderDetailsPage.assignedManagerLink;
      await assignedManagerLink.waitFor({ state: "visible" });

      const assignedManagerName = await orderDetailsPage.getAssignedManagerName();
      expect(assignedManagerName).toBe(selectedManagerName);

      await ordersListPage.open();
      await ordersListPage.tableRowByName(orderId).waitFor({ state: "visible" });
      const orderData = await ordersListPage.getOrderData(orderId);
      expect(orderData.assignedManager).toBe(selectedManagerName);
  });
});
