import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";
import { SALES_PORTAL_URL } from "config/env";
import { IOrderInTable, OrdersTableHeader } from "data/types/order.types";

export class OrdersListPage extends SalesPortalPage {
  readonly ordersPageTitle = this.page.locator("h2.fw-bold");
  readonly addNewOrderButton = this.page.locator('[name="add-button"]');
  readonly tableRow = this.page.locator("tbody tr");
  readonly tableRowByName = (orderName: string) =>
    this.page.locator("table tbody tr", { has: this.page.locator("td", { hasText: orderName }) });

  readonly tableHeader = this.page.locator("thead th div[current]");
  readonly tableHeaderNamed = (name: OrdersTableHeader) =>
    this.tableHeader.filter({ hasText: name });

  readonly tableHeaderArrow = (
    name: OrdersTableHeader,
    { direction }: { direction: "asc" | "desc" }
  ) =>
    this.page
      .locator("thead th", { has: this.page.locator("div[current]", { hasText: name }) })
      .locator(`i.${direction === "asc" ? "bi-arrow-down" : "bi-arrow-up"}`);

  readonly detailsButton = (orderName: string) =>
    this.tableRowByName(orderName).getByTitle("Details");

  readonly searchInput = this.page.locator("#search");
  readonly searchButton = this.page.locator("#search-orders");

  readonly filterButton = this.page.locator("#filter");
  readonly exportButton = this.page.locator("#export");

  readonly uniqueElement = this.addNewOrderButton;

  readonly assignedManagerCell = (orderName: string) =>
    this.tableRowByName(orderName).locator("td").nth(5);

  @logStep("Click Add new order")
  async clickAddNewOrder() {
    await this.addNewOrderButton.click();
  }

  @logStep("Get order data from the table")
  async getOrderData(orderName: string): Promise<IOrderInTable> {
    const [orderNumber, email, price, delivery, status, assignedManager, createdOn] =
      await this.tableRowByName(orderName).locator("td").allInnerTexts();
    return {
      orderNumber: orderNumber!,
      email: email!,
      price: +price!.replace("$", ""),
      delivery: delivery!,
      status: status!,
      assignedManager: assignedManager!,
      createdOn: createdOn!,
    };
  }

  @logStep("Get orders data from the table")
  async getTableData(): Promise<IOrderInTable[]> {
    const data: IOrderInTable[] = [];

    const rows = await this.tableRow.all();
    for (const row of rows) {
      const [orderNumber, email, price, delivery, status, assignedManager, createdOn] = await row
        .locator("td")
        .allInnerTexts();
      data.push({
        orderNumber: orderNumber!,
        email: email!,
        price: +price!.replace("$", ""),
        delivery: delivery!,
        status: status!,
        assignedManager: assignedManager!,
        createdOn: createdOn!,
      });
    }
    return data;
  }

  @logStep("Click details action")
  async clickAction(orderName: string) {
    this.detailsButton(orderName).click();
  }

  @logStep("Click header name from the table")
  async clickTableHeader(name: OrdersTableHeader) {
    await this.tableHeaderNamed(name).click();
  }

  @logStep("Fill search input")
  async fillSearchInput(text: string) {
    await this.searchInput.fill(text);
  }

  @logStep("Click search")
  async clickSearch() {
    await this.searchButton.click();
  }

  @logStep("Click filter")
  async clickFilter() {
    await this.filterButton.click();
  }

  @logStep("Click export")
  async clickExport() {
    await this.exportButton.click();
  }

  @logStep("Click on assigned manager")
  async clickOnAssignedManager(orderName: string) {
    await this.assignedManagerCell(orderName).click();
  }

  @logStep("Open orders-page")
  async open() {
    await this.page.goto(SALES_PORTAL_URL + "orders");
  }
}
