import { expect, test } from "fixtures/api.fixture";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { STATUS_CODES } from "data/statusCodes";
import { ERROR_MESSAGES } from "data/salesPortal/errorMessages";

test.describe("[API] [Sales Portal] [Notifications] - GET /api/notifications", () => {
  let token = "";

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
    }
  );

  test(
    "Should return all notifications for authorized user",
    { tag: [TAGS.REGRESSION, TAGS.NOTIFICATIONS, TAGS.API] },
    async ({ notificationsApiService }) => {
      const notifications = await notificationsApiService.getAll(token);

      expect(Array.isArray(notifications.Notifications)).toBe(true);
      notifications.Notifications.forEach(notification => {
        expect(notification).toHaveProperty("_id");
        expect(notification).toHaveProperty("type");
        expect(notification).toHaveProperty("read");
        expect(typeof notification.read).toBe("boolean");
      });
    }
  );

  test(
    "Should return no unread notifications if all are read",
    { tag: [TAGS.REGRESSION, TAGS.NOTIFICATIONS, TAGS.API] },
    async ({ notificationsApiService }) => {
      await notificationsApiService.markAllAsRead(token);
      const notifications = await notificationsApiService.getAll(token);
      const unreadNotifications = notifications.Notifications.filter(n => !n.read);

      expect(unreadNotifications.length).toBe(0);
    }
  );

  test(
    "Should fail for unauthorized user",
    { tag: [TAGS.REGRESSION, TAGS.NOTIFICATIONS, TAGS.API] },
    async ({ notificationsApi }) => {
      const response = await notificationsApi.get("invalidToken");
      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        IsSuccess: false,
        ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }
  );
});
