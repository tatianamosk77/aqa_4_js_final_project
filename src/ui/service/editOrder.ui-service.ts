import { Page } from "@playwright/test";
import { OrderDetailsPage, OrdersListPage } from "ui/pages/orders";
import { logStep } from "utils/report/logStep.utils";

export class EditOrderUIService {
  ordersListPage: OrdersListPage;
  orderDetailsPage: OrderDetailsPage;

  constructor(private page: Page) {
    this.orderDetailsPage = new OrderDetailsPage(page);
    this.ordersListPage = new OrdersListPage(page);
  }

  @logStep("Open order id for editing")
  async open(id: string) {
    await this.orderDetailsPage.open(`orders/${id}`);
    await this.orderDetailsPage.waitForOpened();
  }
}
