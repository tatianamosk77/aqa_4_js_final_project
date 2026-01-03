import { test, expect } from "fixtures/business.fixture";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import { TAGS } from "data/tags";

test.describe("[Sales Portal] [E2E]", async () => {
  let id_order = "";
  let id_customer = "";
  let token = "";

  test.afterEach(async ({ ordersApiService, customersApiService }) => {
    if (id_order) await ordersApiService.delete(id_order, token);
    id_order = "";
    if (id_customer) await customersApiService.delete(token, id_customer);
    id_customer = "";
  });

  test(
    "Create order → edit order → close order",
    {
      tag: [TAGS.REGRESSION, TAGS.E2E, TAGS.UI],
    },
    async ({
      homeUIService,
      customersApiService,
      addNewOrderModal,
      customersListPage,
      ordersListPage,
      confirmationModal,
      orderDetailsPage,
    }) => {
      token = await customersListPage.getAuthToken();
      const customer = await customersApiService.create(token);
      id_customer = customer._id;

      // Create Order
      await homeUIService.openAsLoggedInUser();
      await homeUIService.openModule("Orders");
      await ordersListPage.waitForOpened();
      await ordersListPage.clickCreateOrder();
      await addNewOrderModal.waitForOpened();
      await addNewOrderModal.selectCustomer(customer.name);
      await addNewOrderModal.selectProduct(0, "Bacon");
      await addNewOrderModal.clickAddProduct();
      await addNewOrderModal.selectProduct(1, "Keyboard");
      await addNewOrderModal.clickAddProduct();
      await addNewOrderModal.selectProduct(2, "Hat");
      await addNewOrderModal.deleteProductByPosition(3);
      let price = await addNewOrderModal.getTotalPriceValue();
      await addNewOrderModal.clickCreate();
      await ordersListPage.waitForOpened();

      await ordersListPage.waitForToast(NOTIFICATIONS.ORDER_CREATED);
      await expect(ordersListPage.tableRowByName(customer.email)).toBeVisible();
      await ordersListPage.clickOrderDetails(customer.email);
      await orderDetailsPage.waitForOpened();
      id_order = await orderDetailsPage.getOrderNumber();

      await expect(orderDetailsPage.totalPrice).toContainText(price);
      let items = await orderDetailsPage.getOrderItems();
      expect(items[0]).toContain("Bacon");
      expect(items[1]).toContain("Keyboard");
      expect(items.length).toBeLessThan(3);
      await expect(orderDetailsPage.orderStatus).toContainText("Draft");

      // Update Order
      await orderDetailsPage.editOrderItem();
      await addNewOrderModal.waitForOpened();
      await addNewOrderModal.clickAddProduct();
      await addNewOrderModal.selectProduct(2, "Hat");
      price = await addNewOrderModal.getTotalPriceValue();
      await addNewOrderModal.clickCreate();

      await ordersListPage.waitForToast(NOTIFICATIONS.ORDER_UPDATED);
      await orderDetailsPage.waitForOpened();
      await expect(orderDetailsPage.totalPrice).toContainText(price);
      items = await orderDetailsPage.getOrderItems();
      expect(items[0]).toContain("Bacon");
      expect(items[1]).toContain("Keyboard");
      expect(items[2]).toContain("Hat");

      // Close Order
      await orderDetailsPage.cancelOrder();
      await confirmationModal.waitForOpened();
      await confirmationModal.clickConfirm();
      await orderDetailsPage.waitForOpened();

      await expect(orderDetailsPage.orderStatus).toContainText("Canceled");
      await orderDetailsPage.waitForToast(NOTIFICATIONS.ORDER_CANCELED);
    }
  );
});
