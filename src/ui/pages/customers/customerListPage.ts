import { CustomerTableHeader, ICustomerInTable } from "data/types/customer.types";
import { SalesPortalPage } from "../sales-portal.page";
import { COUNTRIES } from "data/salesPortal/customers/countries";
import { ConfirmationModal } from "../products/confirmation.modal";
import { CustomerDetailsModal } from "./details.modal";
import { logStep } from "utils/report/logStep.utils";

export class CustomersListPage extends SalesPortalPage {
    readonly detailsModal = new CustomerDetailsModal(this.page);
    readonly deleteModal = new ConfirmationModal(this.page);

    readonly customersPageTitle = this.page.locator("h2.fw-bold");
    readonly addNewCustomerButton = this.page.locator('[name="add-button"]');
    readonly tableRow = this.page.locator("tbody tr");
    readonly tableRowByName = (customerEmail: string) =>
        this.page.locator("table tbody tr", { has: this.page.locator("td", { hasText: customerEmail }) });
    readonly tableRowByIndex = (index: number) => this.page.locator("table tbody tr").nth(index);
    readonly emailCell = (customerEmail: string) => this.tableRowByName(customerEmail).locator("td").nth(0);
    readonly nameCell = (customerEmail: string) => this.tableRowByName(customerEmail).locator("td").nth(1);
    readonly countryCell = (customerEmail: string) => this.tableRowByName(customerEmail).locator("td").nth(2);
    readonly createdOnCell = (nameOrIndex: string | number) =>
        typeof nameOrIndex === "string"
            ? this.tableRowByName(nameOrIndex).locator("td").nth(3)
            : this.tableRowByIndex(nameOrIndex).locator("td").nth(3);
    readonly tableHeader = this.page.locator("thead th div[current]");
    readonly tableHeaderNamed = (email: CustomerTableHeader) => this.tableHeader.filter({ hasText: email });

    readonly tableHeaderArrow = (email: CustomerTableHeader, { direction }: { direction: "asc" | "desc" }) =>
        this.page
            .locator("thead th", { has: this.page.locator("div[current]", { hasText: email }) })
            .locator(`i.${direction === "asc" ? "bi-arrow-down" : "bi-arrow-up"}`);

    readonly editButton = (customerEmail: string) => this.tableRowByName(customerEmail).getByTitle("Edit");
    readonly detailsButton = (customerEmail: string) => this.tableRowByName(customerEmail).getByTitle("Details");
    readonly deleteButton = (customerEmail: string) => this.tableRowByName(customerEmail).getByTitle("Delete");

    readonly searchInput = this.page.locator("#search");
    readonly searchButton = this.page.locator("#search-customer");

    readonly uniqueElement = this.addNewCustomerButton;

    @logStep("Click Add new customer button")
    async clickAddNewCustomer() {
        await this.addNewCustomerButton.click();
    }

    @logStep("Get customer data from the table")
    async getCustomerData(customerEmail: string): Promise<ICustomerInTable> {

        const [email, name, country, createdOn] = await this.tableRowByName(customerEmail).locator("td").allInnerTexts();
        return {
            email: email!,
            name: name!,
            country: country! as COUNTRIES,
            createdOn: createdOn!,
        };
    }
    @logStep("Get customers data from the table")
    async getTableData(): Promise<ICustomerInTable[]> {
        const data: ICustomerInTable[] = [];

        const rows = await this.tableRow.all();
        for (const row of rows) {
            const [email, name, country, createdOn] = await row.locator("td").allInnerTexts();
            data.push({
                email: email!,
                name: name!,
                country: country! as COUNTRIES,
                createdOn: createdOn!,
            });
        }
        return data;
    }

    @logStep("Click edit/delete/details action")
    async clickAction(customerEmail: string, button: "edit" | "delete" | "details") {
        if (button === "edit") await this.editButton(customerEmail).click();
        if (button === "delete") await this.deleteButton(customerEmail).click();
        if (button === "details") await this.detailsButton(customerEmail).click();
    }

    @logStep("Click table header name")
    async clickTableHeader(name: CustomerTableHeader) {
        await this.tableHeaderNamed(name).click();
    }

    @logStep("Fill search input")
    async fillSearchInput(text: string) {
        await this.searchInput.fill(text);
    }

    @logStep("Click search button")
    async clickSearch() {
        await this.searchButton.click();
    }
}