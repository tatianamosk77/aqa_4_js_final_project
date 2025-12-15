import { expect, test } from "fixtures/api.fixture";
import { TAGS } from "data/tags";

test.describe("[API] [Sales Portal] [Notifications] - PATCH /api/notifications/mark-all-read", () => {
  let token = "";

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test("Should mark all notifications as read", 
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
  });

  test("Should fail for unauthorized user", 
    { tag: [TAGS.REGRESSION, TAGS.NOTIFICATIONS, TAGS.API] }, 
    async ({ notificationsApi }) => {
      const response = await notificationsApi.readAll("invalid_token");
      expect(response.status).toBe(401);
      expect(response.body.IsSuccess).toBe(false);
  });
});
