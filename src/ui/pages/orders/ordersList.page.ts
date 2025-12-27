import { Locator } from "@playwright/test";
import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";

export class OrdersListPage extends SalesPortalPage {
  readonly pageTitle = this.page.locator("h2[class='fw-bold']");
  readonly createOrderButton = this.page.locator('button[name="add-button"]');
  readonly searchInput = this.page.locator("#search");
  readonly searchButton = this.page.locator("#search-orders");
  readonly filterButton = this.page.locator("#filter");

  // Table elements
  readonly tableContainer = this.page.locator('#contentInner[data-name="table-orders"]');
  readonly ordersTable = this.page.locator("#table-orders");
  readonly tableHeaders = this.ordersTable.locator("thead th");
  readonly tableRows = this.ordersTable.locator("tbody tr");
  readonly toastBody = this.page.locator(".toast-body");

  // Specific column headers for sorting
  readonly orderNumberHeader = this.page.locator(
    'th:has-text("Order Number") div[onclick*="sortOrdersInTable"]'
  );
  readonly emailHeader = this.page.locator(
    'th:has-text("Email") div[onclick*="sortOrdersInTable"]'
  );
  readonly priceHeader = this.page.locator(
    'th:has-text("Price") div[onclick*="sortOrdersInTable"]'
  );
  readonly deliveryHeader = this.page.locator(
    'th:has-text("Delivery") div[onclick*="sortOrdersInTable"]'
  );
  readonly statusHeader = this.page.locator(
    'th:has-text("Status") div[onclick*="sortOrdersInTable"]'
  );
  readonly assignedManagerHeader = this.page.locator(
    'th:has-text("Assigned Manager") div[onclick*="sortOrdersInTable"]'
  );
  readonly createdOnHeader = this.page.locator(
    'th:has-text("Created On") div[onclick*="sortOrdersInTable"]'
  );

  // Pagination elements
  readonly paginationControls = this.page.locator("#pagination-controls");
  readonly itemsPerPageSelect = this.page.locator("#pagination-select");
  readonly paginationButtons = this.page.locator("#pagination-buttons");
  readonly prevPageButton = this.paginationButtons.locator('button[title="Previous"]');
  readonly nextPageButton = this.paginationButtons.locator('button[title="Next"]');
  readonly currentPageButton = this.paginationButtons.locator(
    'button.btn-primary[aria-current="page"]'
  );

  readonly detailsButtons = this.page.locator('a.btn.table-btn[title="Details"]');
  readonly reopenButtons = this.page.locator('button.btn.table-btn[title="Reopen"]');

  uniqueElement = this.pageTitle;

  @logStep("Open Orders List page")
  async open() {
    await this.openPage("ORDERS");
  }

  @logStep("Search for orders by text: {searchText}")
  async searchOrders(searchText: string) {
    await this.searchInput.fill(searchText);
    await this.searchButton.click();
    await this.waitForSpinners();
  }

  @logStep("Click Create Order button")
  async clickCreateOrder() {
    await this.createOrderButton.click();
  }

  @logStep("Click Filter button")
  async clickFilter() {
    await this.filterButton.click();
  }

  @logStep("Sort orders by column: {columnName}")
  async sortByColumn(columnName: string) {
    const columnHeaders = {
      orderNumber: this.orderNumberHeader,
      email: this.emailHeader,
      price: this.priceHeader,
      delivery: this.deliveryHeader,
      status: this.statusHeader,
      assignedManager: this.assignedManagerHeader,
      createdOn: this.createdOnHeader,
    };

    const header = columnHeaders[columnName as keyof typeof columnHeaders];
    if (header) {
      await header.click();
      await this.waitForSpinners();
    }
  }

  @logStep("Click on order details with Order Number: {orderNumber}")
  async clickOrderDetails(orderNumber: string) {
    const orderRow = this.tableRows.filter({ hasText: orderNumber });
    const detailsLink = orderRow.locator('a.btn.table-btn[title="Details"]');
    await detailsLink.click();
  }

  @logStep("Navigate to order details page for Order Number: {orderNumber}")
  async navigateToOrderDetails(orderNumber: string) {
    await this.clickOrderDetails(orderNumber);
    await this.page.waitForURL(/.*#\/orders\/[a-f0-9]+$/);
  }

  @logStep("Click reopen order with Order Number: {orderNumber}")
  async clickReopenOrder(orderNumber: string) {
    const orderRow = this.tableRows.filter({ hasText: orderNumber });
    const reopenButton = orderRow.locator('button.btn.table-btn[title="Reopen"]');
    await reopenButton.click();
  }

  @logStep("Set items per page: {itemsCount}")
  async setItemsPerPage(itemsCount: string) {
    await this.itemsPerPageSelect.selectOption(itemsCount);
    await this.waitForSpinners();
  }

  @logStep("Go to page number: {pageNumber}")
  async goToPage(pageNumber: number) {
    const pageButton = this.paginationButtons.locator(`button:has-text("${pageNumber}")`);
    await pageButton.click();
    await this.waitForSpinners();
  }

  @logStep("Go to next page")
  async goToNextPage() {
    await this.nextPageButton.click();
    await this.waitForSpinners();
  }

  @logStep("Go to previous page")
  async goToPreviousPage() {
    await this.prevPageButton.click();
    await this.waitForSpinners();
  }

  // Getter methods for extracting data
  @logStep("Get order data by row index: {rowIndex}")
  async getOrderData(rowIndex: number) {
    const row = this.tableRows.nth(rowIndex);
    const cells = row.locator("td");

    return {
      orderNumber: (await cells.nth(0).textContent()) || "",
      email: (await cells.nth(1).textContent()) || "",
      price: (await cells.nth(2).textContent()) || "",
      delivery: (await cells.nth(3).textContent()) || "",
      status: (await cells.nth(4).textContent()) || "",
      assignedManager: (await cells.nth(5).textContent()) || "",
      createdOn: (await cells.nth(6).textContent()) || "",
    };
  }

  @logStep("Get order number by row index: {rowIndex}")
  async getOrderNumber(rowIndex: number): Promise<string> {
    const row = this.tableRows.nth(rowIndex);
    return (await row.locator("td").nth(0).textContent()) || "";
  }

  @logStep("Get order email by row index: {rowIndex}")
  async getOrderEmail(rowIndex: number): Promise<string> {
    const row = this.tableRows.nth(rowIndex);
    return (await row.locator("td").nth(1).textContent()) || "";
  }

  @logStep("Get order status by row index: {rowIndex}")
  async getOrderStatus(rowIndex: number): Promise<string> {
    const row = this.tableRows.nth(rowIndex);
    return (await row.locator("td").nth(4).textContent()) || "";
  }

  @logStep("Get current page number")
  async getCurrentPageNumber(): Promise<number> {
    const currentPageText = await this.currentPageButton.textContent();
    return parseInt(currentPageText || "1");
  }

  @logStep("Get total visible orders count")
  async getVisibleOrdersCount(): Promise<number> {
    return await this.tableRows.count();
  }

  @logStep("Check if next page button is enabled")
  async isNextPageEnabled(): Promise<boolean> {
    return !(await this.nextPageButton.isDisabled());
  }

  @logStep("Check if previous page button is enabled")
  async isPreviousPageEnabled(): Promise<boolean> {
    return !(await this.prevPageButton.isDisabled());
  }

  @logStep("Check if order has reopen button: {orderNumber}")
  async hasReopenButton(orderNumber: string): Promise<boolean> {
    const orderRow = this.tableRows.filter({ hasText: orderNumber });
    const reopenButton = orderRow.locator('button.btn.table-btn[title="Reopen"]');
    return (await reopenButton.count()) > 0;
  }

  // Helper methods
  getOrderRowByNumber(orderNumber: string): Locator {
    return this.tableRows.filter({ hasText: orderNumber });
  }

  getAllOrderRows(): Locator {
    return this.tableRows;
  }

  @logStep("Wait for orders table to load")
  async waitForTableToLoad() {
    await this.tableContainer.waitFor({ state: "visible" });
    await this.waitForSpinners();
  }

  @logStep("Clear search input")
  async clearSearch() {
    await this.searchInput.clear();
  }
}
