import { test, expect } from "fixtures/business.fixture";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import _ from "lodash";
import { convertToDateAndTime } from "utils/date.utils";
import { TAGS } from "data/tags";

test.describe("[Sales Portal] [Customers] [E2E Update]", async () => {
  let id = "";
  let token = "";

  test(
    "Update customer with services",
    {
      tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.UI],
    },
    async ({
      addNewCustomerUIService,
      customersListPage,
      editCustomerUIService,
      customerDetailsPage,
    }) => {
      token = await customersListPage.getAuthToken();
      await addNewCustomerUIService.open();
      const createdCustomer = await addNewCustomerUIService.create();
      id = createdCustomer._id;
      await customersListPage.closeToast();
      await editCustomerUIService.open(id);
      const editedCustomer = await editCustomerUIService.edit(id);
      await expect(customersListPage.toastMessage).toContainText(NOTIFICATIONS.CUSTOMER_UPDATED);
      await expect(customersListPage.tableRowByName(editedCustomer.email)).toBeVisible();

      await customersListPage.detailsButton(editedCustomer.email).click();
      await customerDetailsPage.waitForOpened();
      const actual = await customerDetailsPage.getData();

      expect(actual).toEqual({
        ..._.omit(editedCustomer, ["_id"]),
        createdOn: convertToDateAndTime(editedCustomer.createdOn),
      });
    }
  );

  test.afterEach(async ({ customersApiService }) => {
    if (id) await customersApiService.delete(token, id);
    id = "";
  });
});
