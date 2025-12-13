import test, { expect } from "@playwright/test";
import { generateCustomerDataNew } from "data/salesPortal/customers/generateCustomerData";
import { NOTIFICATIONS } from "data/salesPortal/notifications";
import _ from "lodash";
import { HomePage } from "ui/pages/home.page";
import { AddNewCustomerPage } from "ui/pages/customers/addNewCustomerPage";
import { CustomersListPage } from "ui/pages/customers/customerListPage";
import { TAGS } from "data/tags";

test.describe("[Sales Portal] [Customers]", () => {
  test(
    "Table parsing",
    {
      tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.UI],
    },
    async ({ page }) => {
      const homePage = new HomePage(page);
      const customersListPage = new CustomersListPage(page);
      const addNewCustomerPage = new AddNewCustomerPage(page);

      await homePage.open();
      await homePage.waitForOpened();
      await homePage.clickOnViewModule("Customers");
      await customersListPage.waitForOpened();
      await customersListPage.clickAddNewCustomer();
      await addNewCustomerPage.waitForOpened();

      const customerData = generateCustomerDataNew(); // generateCustomerDataNew содержит рандом значение для city и street

      await addNewCustomerPage.fillForm(customerData);
      await addNewCustomerPage.clickSave();
      await customersListPage.waitForOpened();
      await expect(customersListPage.toastMessage).toContainText(NOTIFICATIONS.CUSTOMER_CREATED);
      await expect(customersListPage.tableRowByName(customerData.email)).toBeVisible();

      const customerFromTable = await customersListPage.getCustomerData(customerData.email);

      const expectedCustomerInTable = _.pick(customerData, ["email", "name", "country"]);
      const actualCustomerInTable = _.omit(customerFromTable, ["createdOn"]);

      expect(actualCustomerInTable).toEqual(expectedCustomerInTable);

      await expect
        .soft(customersListPage.nameCell(customerData.email))
        .toHaveText(customerData.name);
      await expect
        .soft(customersListPage.emailCell(customerData.email))
        .toHaveText(customerData.email);
      await expect
        .soft(customersListPage.countryCell(customerData.email))
        .toHaveText(customerData.country);

      const tableData = await customersListPage.getTableData();
      console.log(tableData);
    }
  );
});
