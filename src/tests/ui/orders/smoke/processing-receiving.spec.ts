import { ORDER_STATUS } from "data/orders/statuses.data";
import { DELIVERY_TYPE, DELIVERY_LOCATION } from "data/types/delivery.types";
import { TAGS } from "data/tags";
import { test, expect } from "fixtures/business.fixture";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";

test.describe("[Smoke][Sales Portal][Orders] Processing - Receiving", () => {
  let token: string;
  let customerName: string;
  let orderId: string;

  test.beforeAll(async ({ loginApiService, customersApiService, productsApiService }) => {
    const { token: authToken } = await loginApiService.loginAsAdminWithUser();
    token = authToken;

    const customer = await customersApiService.create(token, generateCustomerData());
    customerName = customer.name;
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderId) await ordersApiService.delete(orderId, token);
  });

  test("Process order - verify 'Draft' status for new order",
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.UI] },
    async ({ ordersListUIService, orderDetailsPage, addNewOrderUIService }) => {
      await ordersListUIService.open();
      await ordersListUIService.openAddNewOrdersPage();
      const response = await addNewOrderUIService.createMinimalOrder(customerName); 
      orderId = response.order._id;

      await ordersListUIService.openDetailsOrdersPage(orderId);
      const status = await orderDetailsPage.getOrderStatus();
      expect(status).toBe(ORDER_STATUS.DRAFT);
  });

  test("Process order - verify 'In-progress' status when delivery is scheduled",
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.UI] },
    async ({ ordersListUIService, orderDetailsPage, addNewOrderUIService }) => {
      await ordersListUIService.open();
      await ordersListUIService.openAddNewOrdersPage();
      const response = await addNewOrderUIService.createMinimalOrder(customerName); 
      orderId = response.order._id;

      await ordersListUIService.openDetailsOrdersPage(orderId);
      await orderDetailsPage.openDeliveryTab();
      const deliveryTab = orderDetailsPage.getDeliveryTab();
      await deliveryTab.waitForOpened();
      const scheduleDelivery = await deliveryTab.openScheduleOrEditDelivery();
      await scheduleDelivery.waitForOpened();

      await scheduleDelivery.fillDeliveryForm({
        deliveryType: DELIVERY_TYPE.DELIVERY,
        location: DELIVERY_LOCATION.HOME,
      });
      await scheduleDelivery.clickSaveDelivery();
      await deliveryTab.waitForOpened();

      const processButton = orderDetailsPage.processOrderButton;
      await expect(processButton).toBeEnabled();
      await processButton.click();
      const confirmationModal = orderDetailsPage.getConfirmationModal();
      await confirmationModal.clickConfirm();
      await confirmationModal.waitForClosed();
      await orderDetailsPage.waitForSpinners()

      const status = await orderDetailsPage.getOrderStatus();
      expect(status).toBe(ORDER_STATUS.IN_PROCESS);
  });

  test("Process order - verify 'Partially Received' status when received part of products",
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.UI] },
    async ({ ordersListUIService, orderDetailsPage, addNewOrderUIService, productsApiService }) => {
      await ordersListUIService.open();
      await ordersListUIService.openAddNewOrdersPage();
      const secondProduct = await productsApiService.create(token);
      const response = await addNewOrderUIService.createSpecificOrder([0, 1], customerName);
      orderId = response.order._id;

      await ordersListUIService.openDetailsOrdersPage(orderId);
      await orderDetailsPage.openDeliveryTab();
      const deliveryTab = orderDetailsPage.getDeliveryTab();
      await deliveryTab.waitForOpened();
      const scheduleDelivery = await deliveryTab.openScheduleOrEditDelivery();
      await scheduleDelivery.waitForOpened();
      await scheduleDelivery.fillDeliveryForm({
        deliveryType: DELIVERY_TYPE.DELIVERY,
        location: DELIVERY_LOCATION.HOME,
      });
      await scheduleDelivery.clickSaveDelivery();
      await deliveryTab.waitForOpened();

      await orderDetailsPage.processOrder();
      const confirmationModal = orderDetailsPage.getConfirmationModal();
      await confirmationModal.clickConfirm();
      await confirmationModal.waitForClosed();

      const productsSection = orderDetailsPage.requestedProductsSection();
      await productsSection.startReceivingProducts();
      await productsSection.markProductAsReceived(0);
      await productsSection.saveReceivedProducts();
      await orderDetailsPage.waitForSpinners()

      const status = await orderDetailsPage.getOrderStatus();
      expect(status).toBe(ORDER_STATUS.PARTIALLY_RECEIVED);

      await productsApiService.delete(token, secondProduct._id);
  });

  test("Process order - verify 'Received' status when all products are received",
    { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.UI] },
    async ({ ordersListUIService, orderDetailsPage, addNewOrderUIService, productsApiService }) => {
      await ordersListUIService.open();
      await ordersListUIService.openAddNewOrdersPage();
      const secondProduct = await productsApiService.create(token);
      const response = await addNewOrderUIService.createSpecificOrder([0, 1], customerName);
      orderId = response.order._id;

      await ordersListUIService.openDetailsOrdersPage(orderId);
      await orderDetailsPage.openDeliveryTab();
      const deliveryTab = orderDetailsPage.getDeliveryTab();
      await deliveryTab.waitForOpened();
      const scheduleDelivery = await deliveryTab.openScheduleOrEditDelivery();
      await scheduleDelivery.waitForOpened();
      await scheduleDelivery.fillDeliveryForm({
        deliveryType: DELIVERY_TYPE.DELIVERY,
        location: DELIVERY_LOCATION.HOME,
      });
      await scheduleDelivery.clickSaveDelivery();
      await deliveryTab.waitForOpened();

      await orderDetailsPage.processOrder();
      const confirmationModal = orderDetailsPage.getConfirmationModal();
      await confirmationModal.clickConfirm();
      await confirmationModal.waitForClosed();

      const productsSection = orderDetailsPage.requestedProductsSection();
      await productsSection.startReceivingProducts();
      await productsSection.receiveAllProducts();
      await productsSection.saveReceivedProducts();
      await orderDetailsPage.waitForSpinners()

      const status = await orderDetailsPage.getOrderStatus();
      expect(status).toBe(ORDER_STATUS.RECEIVED);

      await productsApiService.delete(token, secondProduct._id);
  });

  test("Process order - verify 'Cancelled' status",
  { tag: [TAGS.ORDERS, TAGS.SMOKE, TAGS.UI] },
  async ({ ordersListUIService, orderDetailsPage, addNewOrderUIService }) => {
    await ordersListUIService.open();
    await ordersListUIService.openAddNewOrdersPage();
    const response = await addNewOrderUIService.createMinimalOrder(customerName); 
    orderId = response.order._id;

    await ordersListUIService.openDetailsOrdersPage(orderId);
    await orderDetailsPage.cancelOrder();
    const confirmationModal = orderDetailsPage.getConfirmationModal();
    await confirmationModal.clickConfirm();
    await confirmationModal.waitForClosed();
    await orderDetailsPage.waitForSpinners();

    const status = await orderDetailsPage.getOrderStatus();
    expect(status).toBe(ORDER_STATUS.CANCELED);
  });
});
