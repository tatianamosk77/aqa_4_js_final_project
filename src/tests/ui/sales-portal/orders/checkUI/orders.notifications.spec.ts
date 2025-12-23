import { expect, test } from 'fixtures/index';
import { TAGS } from 'data/tags';
import { ROUTES } from 'config/uiConfig';
import { STATUS_CODES } from 'data/statusCodes';
import { UI_TEXTS } from 'data/orders/uiTexts.data';
import { ORDER_STATUS } from 'data/orders/statuses.data';
import {
  MOCK_ORDERS_LIST_API_RESPONSE,
  MOCK_ORDER_CANCELED,
  MOCK_ORDER_DRAFT,
  MOCK_ORDER_IN_PROCESS,
} from 'data/orders/mockOrders.data';

// helpers

async function openOrdersModule({
  page,
  headerPage,
  ordersListPage,
}: {
  page: any;
  headerPage: any;
  ordersListPage: any;
}) {
  await headerPage.clickModule('Orders');
  await ordersListPage.waitForOpened();

  // guard: we didn't land on an error page
  await expect(page.getByRole('heading', { name: /404|connection failed/i })).toHaveCount(0);
}


function makeListWithUpdatedStatus(orderId: string, nextStatus: ORDER_STATUS) {
  const replace = (o: any) => (o._id === orderId ? { ...o, status: nextStatus } : o);

  return {
    ...MOCK_ORDERS_LIST_API_RESPONSE,
    Orders: [
      replace(MOCK_ORDER_IN_PROCESS),
      replace(MOCK_ORDER_DRAFT),
      replace(MOCK_ORDER_CANCELED),
    ],
  };
}

test.describe('[UI] [Orders] [Modals] [Reopen Order Modal]', () => {
  test.beforeEach(async ({ page, headerPage }) => {
    await page.goto(ROUTES.HOME);
    await expect(headerPage.uniqueElement).toBeVisible();
  });

  test.afterEach(async ({ page }) => {
    await page.unroute(/.*/);
  });

  
  test(
    'Should open "Reopen Order" modal and reopen canceled order (from Orders List)',
    { tag: [TAGS.UI] },
    async ({ page, headerPage, ordersListPage }) => {
      const orderId = MOCK_ORDER_CANCELED._id;
      let currentList = MOCK_ORDERS_LIST_API_RESPONSE;
      await page.route(/\/api\/orders(\?.*)?$/, async (route) => {
        if (route.request().method() !== 'GET') return route.fallback();

        await route.fulfill({
          status: STATUS_CODES.OK,
          contentType: 'application/json',
          body: JSON.stringify(currentList),
        });
      });

      
      await page.route(new RegExp(`/api/orders/${orderId}/reopen(\\?.*)?$`), async (route) => {
        currentList = makeListWithUpdatedStatus(orderId, ORDER_STATUS.DRAFT);

        await route.fulfill({
          status: STATUS_CODES.OK,
          contentType: 'application/json',
          body: JSON.stringify({ IsSuccess: true }),
        });
      });

      
      await openOrdersModule({ page, headerPage, ordersListPage });

     
      const row = ordersListPage.tableRows.filter({ hasText: orderId });
      await expect(row).toHaveCount(1);

      
      const actionsCell = row.locator('td').last();
      const reopenButton = actionsCell.getByRole('button'); // the only button in Actions for canceled row
      await expect(reopenButton).toBeVisible();

      await reopenButton.click();

   
      const modal = page.locator('.modal-content');
      await expect(modal).toBeVisible();

      await expect(modal.locator('h5')).toHaveText(UI_TEXTS.MODAL_TITLES.REOPEN_ORDER);
      await expect(modal).toContainText(UI_TEXTS.MODAL_CONTENT.REOPEN_ORDER_CONFIRMATION);

      const confirmBtn = modal.getByRole('button', { name: /confirm|reopen|yes/i });

      
      const reopenResponse = page.waitForResponse((r) =>
        r.ok() &&
        new RegExp(`/api/orders/${orderId}/reopen(\\?.*)?$`).test(r.url()) &&
        ['POST', 'PATCH', 'PUT'].includes(r.request().method()),
      );

      await Promise.all([reopenResponse, confirmBtn.click()]);
      await expect(modal).toBeHidden();

      const updatedRow = ordersListPage.tableRows.filter({ hasText: orderId });
      await expect(updatedRow).toHaveCount(1);
      await expect(updatedRow).toContainText(ORDER_STATUS.DRAFT);

      await expect(page.getByRole('heading', { name: /404|connection failed/i })).toHaveCount(0);

      page.on('request', (r) => {
  if (r.url().includes('/api/orders') && ['POST','PATCH','PUT'].includes(r.method())) {
    console.log('ORDERS MUTATION:', r.method(), r.url());
  }
});

    },
  );
});
