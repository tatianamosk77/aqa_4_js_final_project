import { DELIVERY_LOCATION, DELIVERY_TYPE, IDeliveryFormData } from "data/types/delivery.types";
import { COUNTRIES } from "data/salesPortal/customers/countries";
import { TAGS } from "data/tags";
import { test, expect } from "fixtures/business.fixture";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";

test.describe("[Smoke][Sales Portal][Orders] Delivery", () => {
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

  test("Add delivery info for existing order", 
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

      const deliveryData: Partial<IDeliveryFormData> = {
        deliveryType: DELIVERY_TYPE.DELIVERY,
        location: DELIVERY_LOCATION.HOME,
      };

      await scheduleDelivery.fillDeliveryForm(deliveryData);
      await expect(scheduleDelivery.saveDeliveryButton).toBeEnabled();
      await scheduleDelivery.clickSaveDelivery();
      await deliveryTab.waitForOpened();

      const deliveryInfo = await deliveryTab.getStructuredDeliveryData();
      expect(deliveryInfo.address.city).toBe("testCity");
      expect(deliveryInfo.address.street).toBe("testStreet");
      const statusBarDate = await orderDetailsPage.getDeliveryDate();
      expect(statusBarDate).not.toBe("-");
  });

  test("Change delivery info for existing order", 
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

      let deliveryPage = await deliveryTab.openScheduleOrEditDelivery();
      await deliveryPage.waitForOpened();
      //1st save - delivery+home
      await deliveryPage.fillDeliveryForm({});
      await expect(deliveryPage.saveDeliveryButton).toBeEnabled();
      await deliveryPage.clickSaveDelivery();
      await deliveryTab.waitForOpened();

      deliveryPage = await deliveryTab.openScheduleOrEditDelivery();
      await deliveryPage.waitForOpened();
      //2nd save - pickup+Ukraine
      await deliveryPage.deliveryType.selectOption(DELIVERY_TYPE.PICKUP);
      await deliveryPage.countryLocator.selectOption(COUNTRIES.UKRAINE);

      await expect(deliveryPage.saveDeliveryButton).toBeEnabled();
      await deliveryPage.clickSaveDelivery();
      await deliveryTab.waitForOpened();

      const deliveryInfo = await deliveryTab.getStructuredDeliveryData();
      expect(deliveryInfo.deliveryType).toBe(DELIVERY_TYPE.PICKUP);
      expect(deliveryInfo.address?.country).toBe(COUNTRIES.UKRAINE);
  });
});
