import { expect, test } from "fixtures/api.fixture";
import { TAGS } from "data/tags";
import { IOrderData } from "data/types/order.types";

test.describe("[API] [Sales Portal] [Notifications] - PATCH /api/notifications/{notificationId}/read", () => {
  let token = "";
  let firstNotificationId: string;
  let orderId: string;
  let customerId: string;
  let productId: string;

  test.beforeAll(async ({ loginApiService, customersApiService, productsApiService, ordersApiService, notificationsApiService }) => {
    token = await loginApiService.loginAsAdmin();

    const customer = await customersApiService.create(token);
    customerId = customer._id;

    const product = await productsApiService.create(token);
    productId = product._id;

    const testOrderData: IOrderData = {
      customer: customerId,
      products: [productId],
    };

    orderId = await ordersApiService.setupTestNotifications(
      token,
      testOrderData,
      "test-manager-id",
      "Test comment for notification"
    );

    await notificationsApiService.markAllAsRead(token);
    firstNotificationId = (await notificationsApiService.getFirstUnreadNotificationIdForOrder(token, orderId))!;
  });

  test("Should mark single notification as read", 
    { tag: [TAGS.REGRESSION, TAGS.NOTIFICATIONS, TAGS.API] }, 
    async ({ notificationsApiService }) => {
      const updatedNotification = await notificationsApiService.markAsRead(token, firstNotificationId);

      expect(Array.isArray(updatedNotification.Notifications)).toBe(true);
      const notification = updatedNotification.Notifications.find(n => n._id === firstNotificationId);
      expect(notification).toBeDefined();
      expect(notification!.read).toBe(true);
      expect(notification).toHaveProperty("_id");
      expect(notification).toHaveProperty("type");
      expect(notification).toHaveProperty("read");
      expect(notification).toHaveProperty("message");
  });

  test("Should fail for unauthorized user", 
    { tag: [TAGS.REGRESSION, TAGS.NOTIFICATIONS, TAGS.API] }, 
    async ({ notificationsApi }) => {
      const response = await notificationsApi.readOne("some_id", "invalid_token");
      expect(response.status).toBe(401);
      expect(response.body.IsSuccess).toBe(false);
  });
});
