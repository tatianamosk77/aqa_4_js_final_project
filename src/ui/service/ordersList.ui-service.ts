import { expect } from "@playwright/test";
import { IOrderDetails } from "data/types/order.types";
import { OrderDetailsPage, OrdersListPage } from "ui/pages/orders";
import { AddNewOrderModal } from "ui/pages/orders/addNewOrder.modal";
import { convertToDateAndTime } from "utils/date.utils";
import { logStep } from "utils/report/logStep.utils";

export class OrdersListUIService {
  constructor(
    private ordersListPage: OrdersListPage,
    private addNewOrderModal: AddNewOrderModal,
    private orderDetailsPage: OrderDetailsPage
  ) {}

  @logStep("Open Add new orders modal")
  async openAddNewOrdersPage() {
    await this.ordersListPage.clickAddNewOrder();
    await this.addNewOrderModal.waitForOpened();
  }

  @logStep("Open order details")
  async openDetailsOrdersPage(orderNumber: string) {
    await this.ordersListPage.detailsButton(orderNumber).click();
    await this.orderDetailsPage.waitForOpened();
  }

  @logStep("Search order")
  async search(text: string) {
    await this.ordersListPage.fillSearchInput(text);
    await this.ordersListPage.clickSearch();
    await this.ordersListPage.waitForOpened();
  }

  @logStep("Open orders page")
  async open() {
    await this.ordersListPage.open("orders");
    await this.ordersListPage.waitForOpened();
  }

  assertDetailsData(actual: IOrderDetails, expected: IOrderDetails) {
    expect(actual).toEqual({
      expected,
      createdOn: convertToDateAndTime(expected.createdOn),
    });
  }

  @logStep("Assert Customer Row Visible In Table")
  async assertCustomerRowVisibleInTable(orderNumber: string, { visible }: { visible: boolean }) {
    await expect(this.ordersListPage.tableRowByName(orderNumber)).toBeVisible({ visible });
  }
}
