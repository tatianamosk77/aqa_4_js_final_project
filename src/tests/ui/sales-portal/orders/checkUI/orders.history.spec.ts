import { expect, test } from "fixtures/index";
import { TAGS } from "data/tags";
import { STATUS_CODES } from "data/statusCodes";
import { MOCK_ORDERS_LIST_API_RESPONSE, MOCK_ORDER_IN_PROCESS } from "data/orders/mockOrders.data";
import { HistoryTab } from "ui/pages/orders/history.tab";

test.describe("[UI] [Orders] [Pages/Components] [History]", () => {
  test.beforeEach(async ({ homeUIService, ordersListPage, mock, page, orderDetailsPage }) => {
    await homeUIService.openAsLoggedInUser();
    await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE, STATUS_CODES.OK);
    await mock.orderById(MOCK_ORDER_IN_PROCESS._id, MOCK_ORDER_IN_PROCESS, STATUS_CODES.OK);

    await homeUIService.openModule("Orders");
    await ordersListPage.waitForOpened();

    await ordersListPage.clickOrderDetails(MOCK_ORDER_IN_PROCESS._id);
    await page.waitForURL(new RegExp(`#\\/orders\\/${MOCK_ORDER_IN_PROCESS._id}$`));
    await orderDetailsPage.waitForSpinners()
    await expect(orderDetailsPage.orderDetailsHeader).toBeVisible();
    await orderDetailsPage.orderHistoryTab.click();
  });

  test.afterEach(async ({ page }) => {
    await page.unroute(/\/api\/.*/);
  });

  test("Should display Order History tab base UI",
    { tag: [TAGS.UI, TAGS.SMOKE] },
    async ({ page }) => {
      const historyTab = new HistoryTab(page);
      await expect(historyTab.uniqueElement).toBeVisible();
      await expect(historyTab.dataContainer).toBeVisible();
      await expect(historyTab.accordionButtons.first()).toBeVisible();
    }
  );

  test("Should expand history row and show previous/updated values",
    { tag: [TAGS.UI] },
    async ({ page }) => {
      const historyTab = new HistoryTab(page);
      await expect(historyTab.uniqueElement).toBeVisible();
      await expect(historyTab.accordionButtons.first()).toBeVisible();

      await historyTab.expandHistoryRow(0);
      await expect(historyTab.historyEntitiDataRows(0).first()).toBeVisible();

      const row = await historyTab.getHistoryRowData(0);
      expect(row.description.action).toBeTruthy();
      expect(row.description.performer).toBeTruthy();
      expect(row.description.date).toBeTruthy();

      expect(Object.keys(row.data.previous).length).toBeGreaterThan(0);
      expect(Object.keys(row.data.updated).length).toBeGreaterThan(0);
    }
  );

  test("Should expand first history row and render its data",
    { tag: [TAGS.UI] },
    async ({ page }) => {
      const historyTab = new HistoryTab(page);
      await expect(historyTab.accordionButtonBy(0)).toBeVisible();
      await historyTab.expandHistoryRow(0);
      await expect(historyTab.historyEntitiDataRows(0).first()).toBeVisible();
    }
  );
});
