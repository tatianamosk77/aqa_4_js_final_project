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
    await ordersListUIService.openOrdersList(); 
    await ordersListUIService.createNewOrder();
    const response = await addNewOrderUIService.createMinimalOrderSafe(customerName); 
    orderId = response.order._id;

    await ordersListUIService.openOrderDetails(orderId);
    await orderDetailsPage.openDeliveryTab();
    const deliveryTab = orderDetailsPage.getDeliveryTab();  
    await deliveryTab.waitForOpened();
    
    const scheduleDelivery = await deliveryTab.openScheduleOrEditDelivery();
    await scheduleDelivery.waitForOpened();
    
    await scheduleDelivery.fillDeliveryFormSafe({
        deliveryType: DELIVERY_TYPE.DELIVERY,
        location: DELIVERY_LOCATION.HOME
    });
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
    await ordersListUIService.openOrdersList();
    await ordersListUIService.createNewOrder();
    const response = await addNewOrderUIService.createMinimalOrderSafe(customerName); 
    orderId = response.order._id;

    await ordersListUIService.openOrderDetails(orderId);
    await orderDetailsPage.openDeliveryTab();
    const deliveryTab = orderDetailsPage.getDeliveryTab();  
    await deliveryTab.waitForOpened();

    let deliveryPage = await deliveryTab.openScheduleOrEditDelivery();
    await deliveryPage.waitForOpened();
    
    //1st save - delivery+home
    await deliveryPage.fillDeliveryFormSafe({
  deliveryType: DELIVERY_TYPE.DELIVERY,
  location: DELIVERY_LOCATION.HOME
});
await expect(deliveryPage.saveDeliveryButton).toBeEnabled();
await deliveryPage.clickSaveDelivery();
await deliveryTab.waitForOpened();

//2nd save - pickup+Ukraine
deliveryPage = await deliveryTab.openScheduleOrEditDelivery();
await deliveryPage.waitForOpened();

await deliveryPage.fillDeliveryFormSafe({
  deliveryType: DELIVERY_TYPE.PICKUP,
  country: COUNTRIES.UKRAINE
});
await expect(deliveryPage.saveDeliveryButton).toBeEnabled();
await deliveryPage.clickSaveDelivery();
await deliveryTab.waitForOpened();

const deliveryInfo = await deliveryTab.getStructuredDeliveryData();
expect(deliveryInfo.deliveryType).toBe(DELIVERY_TYPE.PICKUP);
expect(deliveryInfo.address?.country).toBe(COUNTRIES.UKRAINE);
})
});