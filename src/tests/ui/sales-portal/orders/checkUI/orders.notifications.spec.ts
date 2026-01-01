import { expect, test } from "fixtures/index";
import { TAGS } from "data/tags";
import { STATUS_CODES } from "data/statusCodes";
import { MOCK_ORDERS_LIST_API_RESPONSE } from "data/orders/mockOrders.data";
import { NotificationsModal } from "ui/pages/notifications /notifications.modal";

test.describe("[UI][Orders][Modals][Notifications]", () => {
  test.beforeEach(async ({ homeUIService, ordersListPage, mock, orderDetailsPage }) => {
    await homeUIService.openAsLoggedInUser();
    await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE, STATUS_CODES.OK);
    await homeUIService.openModule("Orders");
    await ordersListPage.waitForOpened();
    await orderDetailsPage.waitForSpinners();
  });

  test.afterEach(async ({ page }) => {
    await page.unroute(/\/api\/.*/);
  });

  test(
    "Should open Notifications modal and display base UI",
    { tag: [TAGS.UI, TAGS.SMOKE] },
    async ({ page }) => {
      const notifications = new NotificationsModal(page);

      await notifications.open();

      await expect(notifications.modalTitle).toBeVisible();
      await expect(notifications.readAllButton).toBeVisible();
      await expect(notifications.items.first()).toBeVisible();
    }
  );

  test("Should close Notifications modal by button", { tag: [TAGS.UI] }, async ({ page }) => {
    const notifications = new NotificationsModal(page);

    await notifications.open();
    await notifications.closeByBell();
  });
});
