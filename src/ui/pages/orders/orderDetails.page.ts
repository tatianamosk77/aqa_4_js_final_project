import { logStep } from "utils/report/logStep.utils";
import { SalesPortalPage } from "../sales-portal.page";
import { SALES_PORTAL_URL } from "config/env";
import { DeliveryTab } from "./delivery.tab";
import { AssignManagerModal } from "./assignManager.modal";

export class OrderDetailsPage extends SalesPortalPage {
  readonly orderDetailsHeader = this.page.locator("#order-details-header");
  readonly backToOrdersLink = this.orderDetailsHeader.locator("a[href='#/orders']");
  readonly title = this.orderDetailsHeader.locator("h2");
  readonly orderStatusBar = this.orderDetailsHeader.locator("#order-status-bar-container");
  readonly orderNumber = this.orderDetailsHeader
    .locator("text=Order number:")
    .locator("xpath=following-sibling::*")
    .first();
  readonly assignedManager = this.orderDetailsHeader.filter({ hasText: "Assigned Manager" });
  readonly assignedManagerContainer = this.orderDetailsHeader.locator(
    "#assigned-manager-container"
  );

  readonly clickToAssingManager = this.assignedManagerContainer.locator("span");
  readonly assignedManagerLink = this.orderDetailsHeader.locator("#assigned-manager-link");
  readonly editManagerButton = this.assignedManagerContainer.filter({ hasText: "Edit" });
  readonly removeManagerButton = this.assignedManagerContainer.locator("button.text-danger");
  readonly cancelOrderButton = this.orderDetailsHeader.locator("#cancel-order");
  readonly clicktoCancelOrder = this.page.getByRole("button", { name: /yes,\s*cancel/i });
  readonly refreshOrderButton = this.orderDetailsHeader.locator("#refresh-order");
  readonly orderStatus = this.orderStatusBar.filter({ hasText: "Order Status" }).locator("..");
  readonly orderHistoryTab = this.page.getByRole("tab", { name: /order history/i });

  readonly totalPrice = this.orderStatusBar.filter({ hasText: "Total Price" }).locator("..");
  readonly delivery = this.orderStatusBar.filter({ hasText: "Delivery" }).locator("..");
  readonly createdOn = this.orderStatusBar.filter({ hasText: "Created On" }).locator("..");
  readonly processOrderButton = this.orderDetailsHeader.locator("#process-order");
  readonly orderItems = this.page.locator("#products-accordion-section button.accordion-button");
  readonly editItems = this.page.locator("#edit-products-pencil");
  readonly reopenOrderButton = this.page.getByRole("button", { name: /reopen/i });
  readonly deliveryTabButton = this.page.locator("#delivery-tab");

  readonly uniqueElement = this.title;

  @logStep("Open Order Details page")
  async open(id: string) {
    const base = SALES_PORTAL_URL.replace(/\/+$/, "");
    await this.page.goto(`${base}#/orders/${id}`);
  }
  @logStep("Get order number")
  async getOrderNumber() {
    return await this.orderNumber.innerText();
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

  @logStep("Get order item by name")
  async getOrderItemsByName(name: string) {
    return this.orderItems.filter({ hasText: name });
  }

  @logStep("Get order items")
  async getOrderItems() {
    return await this.orderItems.allInnerTexts();
  }

  @logStep("Edit order item")
  async editOrderItem() {
    return this.editItems.click();
  }

  @logStep("Reopen order button")
  async clickReopenOrder() {
    return await this.reopenOrderButton.click();
  }

  @logStep("Open Delivery tab")
  async openDeliveryTab() {
    await this.deliveryTabButton.click();
}

  getDeliveryTab() {
   return new DeliveryTab(this.page);
}

@logStep("Open Assign Manager modal")
async openAssignManagerModal() {
  await this.clickToSelectManager();
  return new AssignManagerModal(this.page);
}
}
