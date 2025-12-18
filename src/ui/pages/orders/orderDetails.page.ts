import { logStep } from "utils/report/logStep.utils";
import { SalesPortalPage } from "../sales-portal.page";

export class OrderDetailsPage extends SalesPortalPage {
  readonly orderDetailsHeader = this.page.locator("#order-details-header");
  readonly backToOrdersLink = this.orderDetailsHeader.locator("a");
  readonly title = this.orderDetailsHeader.locator("h2");
  readonly orderStatusBar = this.orderDetailsHeader.locator("#order-status-bar-container");
  readonly orderNumber = this.orderDetailsHeader.filter({ hasText: "Order number" });
  readonly assignedManager = this.orderDetailsHeader.filter({ hasText: "Assigned Manager" });
  readonly assignedManagerContainer = this.orderDetailsHeader.locator(
    "#assigned-manager-container"
  );

  readonly clickToAssingManager = this.assignedManagerContainer.locator("span");
  readonly assignedManagerLink = this.orderDetailsHeader.locator("#assigned-manager-link");
  readonly editManagerButton = this.assignedManagerContainer.filter({ hasText: "Edit" });
  readonly removeManagerButton = this.assignedManagerContainer.filter({ hasText: "Remove" });
  readonly cancelOrderButton = this.orderDetailsHeader.locator("#cancel-order");
  readonly refreshOrderButton = this.orderDetailsHeader.locator("#refresh-order");
  readonly orderStatus = this.orderStatusBar.filter({ hasText: "Order Status" }).locator("..");
  readonly totalPrice = this.orderStatusBar.filter({ hasText: "Total Price" }).locator("..");
  readonly delivery = this.orderStatusBar.filter({ hasText: "Delivery" }).locator("..");
  readonly createdOn = this.orderStatusBar.filter({ hasText: "Created On" }).locator("..");
  readonly processOrderButton = this.orderDetailsHeader.locator("#process-order");

  readonly uniqueElement = this.title;

  @logStep("Get order number")
  async getOrderNumber() {
    await this.orderNumber.innerText();
  }

  @logStep("Click to select manager")
  async clickToSelectManager() {
    await this.clickToAssingManager.click();
  }
  @logStep("Process order")
  async processOrder() {
    await this.processOrderButton.click();
  }
  @logStep("Refresh order")
  async refreshOrder() {
    await this.refreshOrderButton.click();
  }
  @logStep("Cancel order")
  async cancelOrder() {
    await this.cancelOrderButton.click();
  }
  @logStep("Click to assigned manager")
  async clickToAssignedManager() {
    await this.assignedManagerLink.click();
  }
  @logStep("Edit assigned manager")
  async editManager() {
    await this.editManagerButton.click();
  }
  @logStep("Remove assigned manager")
  async removeManager() {
    await this.removeManagerButton.click();
  }
  @logStep("Get order status")
  async getOrderStatus() {
    return await this.orderStatus.innerText();
  }
  @logStep("Get total price")
  async getTotalPrice() {
    return await this.totalPrice.innerText();
  }
  @logStep("Get order status")
  async getDeliveryDate() {
    return await this.delivery.innerText();
  }
  @logStep("Get created on")
  async getCreatedOn() {
    return await this.createdOn.innerText();
  }
  @logStep("Back to orders list")
  async backToOrdersList() {
    return await this.backToOrdersLink.click();
  }
}
