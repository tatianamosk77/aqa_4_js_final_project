import { expect, Page } from "@playwright/test";
import { ICustomerDetails } from "data/types/customer.types";
import _ from "lodash";
import { AddNewCustomerPage } from "ui/pages/customers/addNewCustomerPage";
import { CustomersListPage } from "ui/pages/customers/customerListPage";
import { convertToFullDateAndTime } from "utils/date.utils";
import { logStep } from "utils/report/logStep.utils";

export class CustomersListUIService {
    customersListPage: CustomersListPage;
    addNewCustomerPage: AddNewCustomerPage;

    constructor(private page: Page) {
        this.customersListPage = new CustomersListPage(page);
        this.addNewCustomerPage = new AddNewCustomerPage(page);
    }

    @logStep("Open Add new customer page")
    async openAddNewCustomerPage() {
        await this.customersListPage.clickAddNewCustomer();
        await this.addNewCustomerPage.waitForOpened();
    }

    @logStep("Open customer details modal")
    async openDetailsModal(customerEmail: string) {
        await this.customersListPage.detailsButton(customerEmail).click();
        await this.customersListPage.detailsModal.waitForOpened();
    }

    @logStep("Open customer delete modal")
    async openDeleteModal(customerEmail: string) {
        await this.customersListPage.clickAction(customerEmail, "delete");
        await this.customersListPage.deleteModal.waitForOpened();
    }

    @logStep("Delete customer")
    async deleteCustomer(customerEmail: string) {
        await this.customersListPage.clickAction(customerEmail, "delete");
        await this.customersListPage.deleteModal.waitForOpened();
        await this.customersListPage.deleteModal.clickConfirm();
        await this.customersListPage.deleteModal.waitForClosed();
    }

    @logStep("Search customer")
    async search(text: string) {
        await this.customersListPage.fillSearchInput(text);
        await this.customersListPage.clickSearch();
        await this.customersListPage.waitForOpened();
    }

    @logStep("Open customers page")
    async open() {
        await this.customersListPage.open("customers");
        await this.customersListPage.waitForOpened();
    }

    assertDetailsData(actual: ICustomerDetails, expected: ICustomerDetails) {
        expect(actual).toEqual({
            ..._.omit(expected, ["_id"]),
            createdOn: convertToFullDateAndTime(expected.createdOn),
        });
    }

    @logStep("Assert Customer Row Visible In Table")
    async assertCustomerRowVisibleInTable(customerEmail: string, { visible }: { visible: boolean }) {
        await expect(this.customersListPage.tableRowByName(customerEmail)).toBeVisible({ visible });
    }
}