import { expect, test } from "fixtures/api.fixture";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { STATUS_CODES } from "data/statusCodes";
import { ERROR_MESSAGES } from "data/salesPortal/errorMessages";

test.describe("[API] [Sales Portal] [Notifications] - PATCH /api/notifications/{notificationId}/read", () => {
  let token = "";
  let firstNotificationId: string;

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.beforeEach(
    async ({
      customersApiService,
      productsApiService,
      ordersApiService,
      notificationsApiService,
    }) => {
      const customer = await customersApiService.create(token);
      const product = await productsApiService.create(token);
      await ordersApiService.create(
        {
          customer: customer._id,
          products: [product._id],
        },
        token
      );

      const notifications = await notificationsApiService.getAll(token);
      expect(notifications.Notifications.length).toBeGreaterThan(0);

      firstNotificationId = notifications.Notifications[0]!._id;
    }
  );

  test(
    "Should mark single notification as read",
    { tag: [TAGS.REGRESSION, TAGS.NOTIFICATIONS, TAGS.API] },
    async ({ notificationsApiService }) => {
      const updatedNotification = await notificationsApiService.markAsRead(
        token,
        firstNotificationId
      );

      expect(Array.isArray(updatedNotification.Notifications)).toBe(true);
      const notification = updatedNotification.Notifications.find(
        n => n._id === firstNotificationId
      );
      expect(notification).toBeDefined();
      expect(notification!.read).toBe(true);
      expect(notification).toHaveProperty("_id");
      expect(notification).toHaveProperty("type");
      expect(notification).toHaveProperty("read");
      expect(notification).toHaveProperty("message");
    }
  );

  test(
    "Should fail for unauthorized user",
    { tag: [TAGS.REGRESSION, TAGS.NOTIFICATIONS, TAGS.API] },
    async ({ notificationsApi }) => {
      const response = await notificationsApi.readOne("someId", "invalidToken");
      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        IsSuccess: false,
        ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }
  );
});
