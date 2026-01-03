import { test, expect } from "fixtures/business.fixture";
import { TAGS } from "data/tags";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { ORDER_STATUS } from "data/orders/statuses.data";

test.describe("[Smoke][Orders] Cancel - Reopen order", () => {
  let token: string;
  let customerName: string;
  let orderId: string;

  test.beforeAll(async ({ loginApiService, customersApiService }) => {
    const { token: authToken } = await loginApiService.loginAsAdminWithUser();
    token = authToken;

    const customer = await customersApiService.create(
      token,
      generateCustomerData()
    );
    customerName = customer.name;
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderId) {
      await ordersApiService.delete(orderId, token);
      orderId = "";
    }
  });

  test("Cancel and reopen order from Draft status",
    { tag: [TAGS.SMOKE, TAGS.ORDERS, TAGS.UI] },
    async ({
      ordersListUIService,
      addNewOrderUIService,
      orderDetailsPage,
      confirmationModal,
    }) => {
      await ordersListUIService.openOrdersList();
      await ordersListUIService.createNewOrder();
      const response = await addNewOrderUIService.createMinimalOrder(customerName);
      orderId = response.order._id;
      await ordersListUIService.openOrderDetails(orderId);

      const initialStatus = await orderDetailsPage.getOrderStatusText();
      expect(initialStatus).toBe(ORDER_STATUS.DRAFT);
      await orderDetailsPage.waitForSpinners();
      await orderDetailsPage.cancelOrder();
      await confirmationModal.clickConfirmSafe();

      // проверяем статус Canceled и наличие кнопки Reopen order
      await orderDetailsPage.reopenOrderButton.waitFor({ state: "visible", timeout: 60000 });
      const canceledStatus = await orderDetailsPage.getOrderStatusText();
      expect(canceledStatus).toBe(ORDER_STATUS.CANCELED);
      await expect(orderDetailsPage.reopenOrderButton).toBeVisible();

      // восстановление заказа
      await orderDetailsPage.clickReopenOrder();
      await confirmationModal.clickConfirmSafe();

      // Проверяем, что статус снова Draft и кнокпка Cancel order снова видна
      await orderDetailsPage.cancelOrderButton.waitFor({ state: "visible", timeout: 60000 });
      const reopenedStatus = await orderDetailsPage.getOrderStatusText();
      expect(reopenedStatus).toBe(ORDER_STATUS.DRAFT);
      await expect(orderDetailsPage.cancelOrderButton).toBeVisible();
    }
  );
});
