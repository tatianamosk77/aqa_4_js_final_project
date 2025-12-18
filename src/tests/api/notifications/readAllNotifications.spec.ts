import { expect, test } from "fixtures/api.fixture";
import { TAGS } from "data/tags";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { STATUS_CODES } from "data/statusCodes";
import { ERROR_MESSAGES } from "data/salesPortal/errorMessages";

test.describe("[API] [Sales Portal] [Notifications] - PATCH /api/notifications/mark-all-read", () => {
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
    "Should mark all notifications as read",
    { tag: [TAGS.REGRESSION, TAGS.NOTIFICATIONS, TAGS.API] },
    async ({ notificationsApiService }) => {
      const updatedNotifications = await notificationsApiService.markAllAsRead(token);

      expect(Array.isArray(updatedNotifications.Notifications)).toBe(true);
      updatedNotifications.Notifications.forEach(notification => {
        expect(notification).toHaveProperty("_id");
        expect(notification).toHaveProperty("type");
        expect(notification).toHaveProperty("read");
        expect(notification.read).toBe(true);
      });
    }
  );

  test(
    "Should fail for unauthorized user",
    { tag: [TAGS.REGRESSION, TAGS.NOTIFICATIONS, TAGS.API] },
    async ({ notificationsApi }) => {
      const response = await notificationsApi.readAll("invalidToken");
      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        IsSuccess: false,
        ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
      });
    }
  );
});
