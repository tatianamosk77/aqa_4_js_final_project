import { expect, test } from "fixtures/index";
import { TAGS } from "data/tags";
import {
  MOCK_ORDERS_LIST_API_RESPONSE,
  MOCK_ORDER_DRAFT,
  MOCK_ORDER_IN_PROCESS,
} from "data/orders/mockOrders.data";
import { STATUS_CODES } from "data/statusCodes";
import { IOrderFilteredResponse, IOrderFromResponse } from "data/types/order.types";

test.describe("[UI] [Orders] [Pages/Components]", () => {
  test.describe("[UI] [Orders] [List]", () => {
    test.beforeEach(async ({ homeUIService, ordersListPage, mock }) => {
      await homeUIService.openAsLoggedInUser();
      await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE, STATUS_CODES.OK);

      await homeUIService.openModule("Orders");
      await ordersListPage.waitForOpened();
    });

      test.afterEach(async ({ page }) => {
    await page.unroute(/\/api\/.*/);
  });

    test("Should display Orders List base UI",
      { tag: [TAGS.UI, TAGS.SMOKE] },
      async ({ ordersListPage }) => {
        await expect(ordersListPage.pageTitle).toBeVisible();
        await expect(ordersListPage.pageTitle).toHaveText(/Orders List/i);

        await expect(ordersListPage.createOrderButton).toBeVisible();

        await expect(ordersListPage.searchInput).toBeVisible();
        await expect(ordersListPage.searchButton).toBeVisible();
        await expect(ordersListPage.filterButton).toBeVisible();

        await expect(ordersListPage.tableContainer).toBeVisible();
        await expect(ordersListPage.ordersTable).toBeVisible();

        await expect(ordersListPage.paginationControls).toBeVisible();
      }
    );

    test("Should render table rows from mocked orders response",
      { tag: [TAGS.UI] },
      async ({ ordersListPage }) => {
        await expect(ordersListPage.tableRows).toHaveCount(
          MOCK_ORDERS_LIST_API_RESPONSE.Orders.length
        );

        await expect(ordersListPage.tableContainer).toContainText(
          MOCK_ORDERS_LIST_API_RESPONSE.Orders[0]!._id
        );
      }
    );

    test("Should update table after Search (via new /api/orders mock)",
      { tag: [TAGS.UI] },
      async ({ ordersListPage, mock }) => {
        const filteredResponse: IOrderFilteredResponse = {
          Orders: [MOCK_ORDER_DRAFT],
          total: 1,
          page: 1,
          limit: 10,
          search: "bob",
          status: [],
          sorting: {
            sortField: "createdOn" as any,
            sortOrder: "desc" as any,
          },
          IsSuccess: true,
          ErrorMessage: null,
        };

        await mock.orders(filteredResponse, STATUS_CODES.OK);

        await ordersListPage.searchOrders("bob");

        await expect(ordersListPage.tableRows).toHaveCount(1);
        await expect(ordersListPage.tableContainer).toContainText(MOCK_ORDER_DRAFT._id);
      }
    );

    test("Should allow sorting by columns without breaking UI",
      { tag: [TAGS.UI] },
      async ({ ordersListPage }) => {
        await ordersListPage.sortByColumn("createdOn");
        await expect(ordersListPage.ordersTable).toBeVisible();

        await ordersListPage.sortByColumn("price");
        await expect(ordersListPage.ordersTable).toBeVisible();
      }
    );

    test("Should display pagination UI", { tag: [TAGS.UI] }, async ({ ordersListPage }) => {
      await expect(ordersListPage.paginationButtons).toBeVisible();
      await expect(ordersListPage.ordersTable).toBeVisible();
    });

    test("Should navigate to Order Details from Orders List via Details button",
      { tag: [TAGS.UI, TAGS.SMOKE] },
      async ({ page, ordersListPage, orderDetailsPage, mock }) => {
        const order: IOrderFromResponse = MOCK_ORDERS_LIST_API_RESPONSE.Orders[0]!;
        await mock.orderById(order._id, order, STATUS_CODES.OK);

        await ordersListPage.clickOrderDetails(order._id);

        await page.waitForURL(new RegExp(`#\\/orders\\/${order._id}$`));
        await expect(orderDetailsPage.orderDetailsHeader).toBeVisible();
      }
    );
  });

  test.describe("[UI] [Orders] [Details]", () => {
    let order: IOrderFromResponse;

    test.beforeEach(async ({ homeUIService, ordersListPage, orderDetailsPage, mock, page }) => {
      await homeUIService.openAsLoggedInUser();

      order = MOCK_ORDER_IN_PROCESS;
      await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE, STATUS_CODES.OK);
      await mock.orderById(order._id, order, STATUS_CODES.OK);

      await homeUIService.openModule("Orders");
      await ordersListPage.waitForOpened();

      await ordersListPage.clickOrderDetails(order._id);
      await page.waitForURL(new RegExp(`#\\/orders\\/${order._id}$`));
      await expect(orderDetailsPage.orderDetailsHeader).toBeVisible();
    });

    test("Should display Order Details base UI (header + status bar)",
      { tag: [TAGS.UI, TAGS.SMOKE] },
      async ({ orderDetailsPage }) => {
        await expect(orderDetailsPage.title).toBeVisible();
        await expect(orderDetailsPage.title).toHaveText(/Order Details/i);

        await expect(orderDetailsPage.orderStatusBar).toBeVisible();
        await expect(orderDetailsPage.orderStatus).toBeVisible();
        await expect(orderDetailsPage.totalPrice).toBeVisible();
        await expect(orderDetailsPage.delivery).toBeVisible();
        await expect(orderDetailsPage.createdOn).toBeVisible();

        await expect(orderDetailsPage.cancelOrderButton).toBeVisible();
        await expect(orderDetailsPage.refreshOrderButton).toBeVisible();
      }
    );

    test("Should display Order number and Assigned Manager section",
      { tag: [TAGS.UI] },
      async ({ orderDetailsPage }) => {
        await expect(orderDetailsPage.orderNumber).toBeVisible();
        await expect(orderDetailsPage.assignedManager).toBeVisible();
        await expect(orderDetailsPage.assignedManagerContainer).toBeVisible();
      }
    );

    test("Should navigate back to Orders list from Order Details",
      { tag: [TAGS.UI] },
      async ({ page, orderDetailsPage }) => {
        await orderDetailsPage.backToOrdersList();
        await expect(page).toHaveURL(/#\/orders$/);
      }
    );

    test("Should refresh Order Details and stay on the same page",
      { tag: [TAGS.UI] },
      async ({ orderDetailsPage, mock }) => {
        const refreshedOrder = { ...order, status: order.status };
        await mock.orderById(order._id, refreshedOrder, STATUS_CODES.OK);

        await orderDetailsPage.refreshOrder();

        await orderDetailsPage.waitForSpinners();
        await expect(orderDetailsPage.orderDetailsHeader).toBeVisible();
        await expect(orderDetailsPage.orderStatus).toBeVisible();
      }
    );
  });
});
