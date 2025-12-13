import { NOTIFICATIONS } from "data/salesPortal/notifications";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { expect, test } from "fixtures/business.fixture";

test.describe("[Sales Portal] [Customers]", () => {
  test(
    "Delete",
    {
      tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.UI],
    },
    async ({
      customersListUIService,
      homeUIService,
      customersApiService,
      customersListPage,
      customersApi,
    }) => {
      const token = await customersListPage.getAuthToken();
      await customersListPage.open();
      const createdCustomer = await customersApiService.create(token);
      await homeUIService.openModule("Customers");
      await customersListUIService.deleteCustomer(createdCustomer.email);
      const deleted = await customersApi.getById(createdCustomer._id, token);
      expect(deleted.status).toBe(STATUS_CODES.NOT_FOUND);
      await expect(customersListPage.toastMessage).toContainText(NOTIFICATIONS.CUSTOMER_DELETED);
      await expect(customersListPage.tableRowByName(createdCustomer.email)).not.toBeVisible();
    }
  );
});
