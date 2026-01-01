import { expect, test } from "fixtures/index";
import {
  MOCK_MANAGER_JACKLINE,
  MOCK_ORDER_CANCELED,
  MOCK_ORDERS_LIST_API_RESPONSE,
} from "data/orders/mockOrders.data";
import { TAGS } from "data/tags";
import { STATUS_CODES } from "data/statusCodes";
import { UI_TEXTS } from "data/orders/uiTexts.data";
import { AssignManagerModal } from "ui/pages/orders/assignManager.modal";
import { ConfirmationModal } from "ui/pages/orders/confirmation.modal";
import { OrdersListPage } from "ui/pages/orders/ordersList.page";

test.describe("[UI] [Orders] [Orders List]", () => {
  test.beforeEach(async ({ homeUIService, ordersListPage, mock }) => {
    await homeUIService.openAsLoggedInUser();
    await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE, STATUS_CODES.OK);

    await homeUIService.openModule("Orders");
    await ordersListPage.waitForOpened();
  });

  test.afterEach(async ({ page }) => {
    await page.unroute(/\/api\/.*/);
  });

  test(
    "Should display correct number of orders in the table",
    { tag: [TAGS.SMOKE, TAGS.UI] },
    async ({ ordersListPage }) => {
      await expect(ordersListPage.tableRows).toHaveCount(
        MOCK_ORDERS_LIST_API_RESPONSE.Orders.length
      );
    }
  );
});

test.describe("[UI] [Orders] [Modals] [Create Order Modal]", () => {
  test.beforeEach(async ({ homeUIService, ordersListPage, mock }) => {
    await homeUIService.openAsLoggedInUser();
    await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE, STATUS_CODES.OK);

    await homeUIService.openModule("Orders");
    await ordersListPage.waitForOpened();
  });

  test.afterEach(async ({ page }) => {
    await page.unroute(/\/api\/.*/);
  });

  test(
    "Should open 'Create New Order' modal and display its basic UI",
    { tag: [TAGS.SMOKE, TAGS.UI] },
    async ({ ordersListPage, addNewOrderModal }) => {
      await ordersListPage.createOrderButton.click();

      await expect(addNewOrderModal.uniqueElement).toBeVisible();
      await expect(addNewOrderModal.title).toHaveText(UI_TEXTS.MODAL_TITLES.CREATE_ORDER);

      await expect(addNewOrderModal.customerDropdown).toBeVisible();
      await expect(addNewOrderModal.productDropdown.first()).toBeVisible();

      await expect(addNewOrderModal.createButton).toBeVisible();
      await expect(addNewOrderModal.cancelButton).toBeVisible();
    }
  );
});

test.describe("[UI] [Orders][Modals] [Cancel Order Modal]", () => {
  let baseOrder = MOCK_ORDERS_LIST_API_RESPONSE.Orders[0]!;
  let orderId = "";

  test.beforeEach(async ({ homeUIService, ordersListPage, mock, page, orderDetailsPage }) => {
    await homeUIService.openAsLoggedInUser();

    baseOrder = MOCK_ORDERS_LIST_API_RESPONSE.Orders[0]!;
    if (!baseOrder) throw new Error("No orders in mock response");
    orderId = baseOrder._id;

    await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE, STATUS_CODES.OK);
    await mock.orderById(orderId, baseOrder, STATUS_CODES.OK);

    await homeUIService.openModule("Orders");
    await ordersListPage.waitForOpened();

    await ordersListPage.clickOrderDetails(orderId);
    await page.waitForURL(new RegExp(`#\\/orders\\/${orderId}$`));

    await orderDetailsPage.waitForSpinners();
  });

  test.afterEach(async ({ page }) => {
    await page.unroute(/\/api\/.*/);
  });

  test("Cancel Order modal opens and confirms", async ({ page, orderDetailsPage, mock }) => {
    const confirmationModal = new ConfirmationModal(page);
    const ordersListPage = new OrdersListPage(page);

    await expect(page.locator("#title .spinner-border")).toBeHidden();
    await expect(orderDetailsPage.orderDetailsHeader).toBeVisible();

    const canceledOrder = {
      ...MOCK_ORDER_CANCELED,
      _id: orderId,
      customer: baseOrder.customer,
    };

    await page.route(new RegExp(`/api/orders/${orderId}.*`, "i"), async route => {
      const method = route.request().method();
      if (!["PUT", "POST"].includes(method)) return route.fallback();

      await route.fulfill({
        status: STATUS_CODES.OK,
        contentType: "application/json",
        body: JSON.stringify({ IsSuccess: true, ErrorMessage: null, Order: canceledOrder }),
      });
    });

    await mock.orderById(orderId, canceledOrder, STATUS_CODES.OK);

    await orderDetailsPage.waitForSpinners();
    await orderDetailsPage.cancelOrderButton.click();

    await expect(confirmationModal.uniqueElement).toBeVisible();
    await expect(confirmationModal.title).toHaveText(UI_TEXTS.MODAL_TITLES.CANCEL_ORDER);
    await expect(confirmationModal.confirmationMessage).toHaveText(
      UI_TEXTS.MODAL_CONTENT.CANCEL_ORDER_QUESTION
    );

    await expect(confirmationModal.cancelButton).toBeVisible();
    await expect(confirmationModal.confirmButton).toBeVisible();
    await confirmationModal.clickConfirm();
    await expect(confirmationModal.uniqueElement).toBeHidden();

    await expect(ordersListPage.toastBody).toBeVisible();
    await expect(ordersListPage.toastBody).toContainText(
      UI_TEXTS.MODAL_CONTENT.CANCEL_ORDER_CONFIRMATION
    );
  });
});

test.describe("[UI] [Orders] [Modals] [Remove Manager Modal]", () => {
  test.afterEach(async ({ page }) => {
    await page.unroute(/\/api\/.*/);
  });

  test.beforeEach(async ({ homeUIService, ordersListPage, orderDetailsPage, mock, page }) => {
    await homeUIService.openAsLoggedInUser();

    const targetOrder =
      MOCK_ORDERS_LIST_API_RESPONSE.Orders.find(o => o.assignedManager) ??
      MOCK_ORDERS_LIST_API_RESPONSE.Orders[0];

    if (!targetOrder) throw new Error("No orders in mock response");
    await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE, STATUS_CODES.OK);
    await mock.orderById(targetOrder._id, targetOrder, STATUS_CODES.OK);

    await homeUIService.openModule("Orders");
    await ordersListPage.waitForOpened();

    await ordersListPage.clickOrderDetails(targetOrder._id);
    await page.waitForURL(new RegExp(`#\\/orders\\/${targetOrder._id}$`));

    await orderDetailsPage.waitForSpinners();
    await expect(orderDetailsPage.orderDetailsHeader).toBeVisible();
  });

  test(
    "Should open 'Remove Manager' modal and display its basic UI",
    { tag: [TAGS.UI] },
    async ({ page, orderDetailsPage, mock }) => {
      const confirmationModal = new ConfirmationModal(page);
      const ordersListPage = new OrdersListPage(page);

      const targetOrder =
        MOCK_ORDERS_LIST_API_RESPONSE.Orders.find(o => o.assignedManager) ??
        MOCK_ORDERS_LIST_API_RESPONSE.Orders[0];

      if (!targetOrder) throw new Error("No orders in mock response");

      const updatedOrder = { ...targetOrder, assignedManager: null };

      await page.route(new RegExp(`/api/orders/${targetOrder._id}.*`, "i"), async route => {
        const method = route.request().method();
        if (!["PUT", "POST", "DELETE", "PATCH"].includes(method)) return route.fallback();

        await route.fulfill({
          status: STATUS_CODES.OK,
          contentType: "application/json",
          body: JSON.stringify({ IsSuccess: true, ErrorMessage: null, Order: updatedOrder }),
        });
      });

      await mock.orderById(targetOrder._id, updatedOrder, STATUS_CODES.OK);

      await orderDetailsPage.waitForSpinners();
      await orderDetailsPage.removeManager();

      await expect(confirmationModal.uniqueElement).toBeVisible();
      await expect(confirmationModal.title).toHaveText(UI_TEXTS.MODAL_TITLES.UNASSIGN_MANAGER);
      await expect(confirmationModal.confirmationMessage).toContainText(
        UI_TEXTS.MODAL_CONTENT.UNASSIGN_MANAGER_CONFIRMATION
      );

      await confirmationModal.clickConfirm();
      await expect(confirmationModal.uniqueElement).toBeHidden();

      await expect(ordersListPage.toastBody).toBeVisible();
      await expect(ordersListPage.toastBody).toContainText(/manager/i);
      await expect(orderDetailsPage.clickToAssingManager).toBeVisible();
    }
  );
});

test.describe("[UI] [Orders] [Modals] [Assign Manager Modal]", () => {
  let targetOrder = MOCK_ORDERS_LIST_API_RESPONSE.Orders.find(o => o.status === "Draft")!;
  let orderId = "";

  test.beforeEach(async ({ page, homeUIService, ordersListPage, orderDetailsPage, mock }) => {
    await homeUIService.openAsLoggedInUser();

    targetOrder =
      MOCK_ORDERS_LIST_API_RESPONSE.Orders.find(o => o.status === "Draft") ??
      MOCK_ORDERS_LIST_API_RESPONSE.Orders[0]!;
    if (!targetOrder) throw new Error("No orders in mock response");

    orderId = targetOrder._id;

    await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE, STATUS_CODES.OK);
    await mock.orderById(orderId, targetOrder, STATUS_CODES.OK);

    await page.route(/\/api\/managers.*$/i, async route => {
      if (route.request().method() !== "GET") return route.fallback();

      await route.fulfill({
        status: STATUS_CODES.OK,
        contentType: "application/json",
        body: JSON.stringify({
          IsSuccess: true,
          ErrorMessage: null,
          Managers: [
            {
              _id: MOCK_MANAGER_JACKLINE._id,
              username: MOCK_MANAGER_JACKLINE.username,
              firstName: MOCK_MANAGER_JACKLINE.firstName,
              lastName: MOCK_MANAGER_JACKLINE.lastName,
              createdOn: MOCK_MANAGER_JACKLINE.createdOn,
            },
          ],
          total: 1,
          page: 1,
          limit: 10,
          search: "",
        }),
      });
    });

    await homeUIService.openModule("Orders");
    await ordersListPage.waitForOpened();

    await ordersListPage.clickOrderDetails(orderId);
    await page.waitForURL(new RegExp(`#\\/orders\\/${orderId}$`));

    await orderDetailsPage.waitForSpinners();
    await expect(orderDetailsPage.orderDetailsHeader).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.unroute(/\/api\/.*/);
  });
  test("Should open 'Assign Manager' modal and assign manager", async ({
    page,
    orderDetailsPage,
    mock,
  }) => {
    const assignManagerModal = new AssignManagerModal(page);

    const nameRe = /Jackeline\s+Padberg/i;
    const updatedOrder = { ...targetOrder, assignedManager: MOCK_MANAGER_JACKLINE };

    const assignUrlRe = new RegExp(`/api/orders/${orderId}/assign-manager/[^/?]+(\\?.*)?$`, "i");

    const putPromise = page.waitForResponse(resp => {
      return assignUrlRe.test(resp.url()) && resp.request().method() === "PUT";
    });

    await page.route(assignUrlRe, async route => {
      if (route.request().method() !== "PUT") return route.fallback();

      await route.fulfill({
        status: STATUS_CODES.OK,
        contentType: "application/json",
        body: JSON.stringify({ IsSuccess: true, ErrorMessage: null, Order: updatedOrder }),
      });
    });

    await mock.orderById(orderId, updatedOrder, STATUS_CODES.OK);

    await orderDetailsPage.waitForSpinners();
    await orderDetailsPage.clickToSelectManager();

    await expect(assignManagerModal.uniqueElement).toBeVisible();
    await expect(assignManagerModal.title).toHaveText(UI_TEXTS.MODAL_TITLES.ASSIGN_MANAGER);

    await assignManagerModal.managerSearchInput.fill(MOCK_MANAGER_JACKLINE.firstName);
    await expect(assignManagerModal.managerItems.first()).toBeVisible();

    const item = assignManagerModal.managerItems.filter({ hasText: nameRe }).first();
    await expect(item).toBeVisible();
    await item.click();

    await assignManagerModal.clickEdit();

    await putPromise;
    await expect(assignManagerModal.uniqueElement).toBeHidden();
    await orderDetailsPage.waitForSpinners();

    await expect(orderDetailsPage.assignedManagerContainer).toContainText(nameRe);
  });
});

test.describe("[UI] [Orders] [Details] [Refresh Order]", () => {
  let targetOrder = MOCK_ORDERS_LIST_API_RESPONSE.Orders[0]!;
  let orderId = "";

  test.beforeEach(async ({ homeUIService, ordersListPage, orderDetailsPage, mock, page }) => {
    await homeUIService.openAsLoggedInUser();

    targetOrder = MOCK_ORDERS_LIST_API_RESPONSE.Orders[0]!;
    if (!targetOrder) throw new Error("No orders in mock response");
    orderId = targetOrder._id;

    await mock.orders(MOCK_ORDERS_LIST_API_RESPONSE, STATUS_CODES.OK);
    await mock.orderById(orderId, targetOrder, STATUS_CODES.OK);

    await homeUIService.openModule("Orders");
    await ordersListPage.waitForOpened();
    await ordersListPage.clickOrderDetails(orderId);
    await page.waitForURL(new RegExp(`#\\/orders\\/${orderId}$`));

    await orderDetailsPage.waitForSpinners();
    await expect(orderDetailsPage.orderDetailsHeader).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.unroute(/\/api\/.*/);
  });

  test(
    "Should refresh order and stay on Order Details page",
    { tag: [TAGS.UI] },
    async ({ orderDetailsPage }) => {
      await orderDetailsPage.waitForSpinners();
      await expect(orderDetailsPage.orderDetailsHeader).toBeVisible();
      await orderDetailsPage.refreshOrder();

      await orderDetailsPage.waitForSpinners();
      await expect(orderDetailsPage.orderDetailsHeader).toBeVisible();
      await expect(orderDetailsPage.orderDetailsHeader).toBeVisible();
      await expect(orderDetailsPage.orderStatus).toBeVisible();
      await expect(orderDetailsPage.totalPrice).toBeVisible();
    }
  );
});
