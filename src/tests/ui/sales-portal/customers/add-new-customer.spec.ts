import { test, expect } from "fixtures/business.fixture";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import _ from "lodash";
import { TAGS } from "data/tags";

test.describe("[Sales Portal] [Customers] [E2E Add]", async () => {
  let id = "";
  let token = "";

  test(
    "Add customer with services",
    {
      tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.UI],
    },
    async ({ addNewCustomerUIService, customersListPage }) => {
      token = await customersListPage.getAuthToken();
      await addNewCustomerUIService.open();
      const createdCustomer = await addNewCustomerUIService.create();
      id = createdCustomer._id;
      await expect(customersListPage.toastMessage).toContainText(NOTIFICATIONS.CUSTOMER_CREATED);
      await expect(customersListPage.tableRowByName(createdCustomer.name)).toBeVisible();
    }
  );

  test.afterEach(async ({ customersApiService }) => {
    if (id) await customersApiService.delete(token, id);
    id = "";
  });
});
