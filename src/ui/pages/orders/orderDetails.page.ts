import { logStep } from "utils/report/logStep.utils";
import { SalesPortalPage } from "../sales-portal.page";
import { SALES_PORTAL_URL } from "config/env";
import { expect } from "fixtures";

export class OrderDetailsPage extends SalesPortalPage {
  // --- ЛОКАТОРЫ ХЕДЕРА ---
  readonly orderDetailsHeader = this.page.locator("#order-details-header");
  readonly backToOrdersLink = this.orderDetailsHeader.locator("a[href='#/orders']");
  readonly title = this.orderDetailsHeader.locator("h2");
  readonly uniqueElement = this.title;

  // --- ЛОКАТОРЫ СТАТУС-БАРА ---
  readonly orderStatusBar = this.orderDetailsHeader.locator("#order-status-bar-container");
  readonly orderNumber = this.orderDetailsHeader
    .locator("text=Order number:")
    .locator("xpath=following-sibling::*")
    .first();
  readonly orderStatus = this.orderStatusBar.filter({ hasText: "Order Status" }).locator("..");
  readonly totalPrice = this.orderStatusBar.filter({ hasText: "Total Price" }).locator("..");
  readonly delivery = this.orderStatusBar.filter({ hasText: "Delivery" }).locator("..");
  readonly createdOn = this.orderStatusBar.filter({ hasText: "Created On" }).locator("..");

  // --- ЛОКАТОРЫ МЕНЕДЖЕРА ---
  readonly assignedManagerContainer = this.orderDetailsHeader.locator(
    "#assigned-manager-container"
  );
  readonly clickToSelectManagerButton = this.page.locator("#assigned-manager-container u");
  readonly clickToAssingManager = this.assignedManagerContainer.locator("span");
  readonly assignedManagerLink = this.orderDetailsHeader.locator("#assigned-manager-link");
  readonly assignedManager = this.assignedManagerLink;
  // readonly editManagerButton = this.assignedManagerContainer.filter({ hasText: "Edit" });
  readonly editManagerButton = this.page.locator('button[title="Edit Assigned Manager"]');
  readonly removeManagerButton = this.assignedManagerContainer.locator("button.text-danger");
  readonly removeManagerIcon = this.page.locator('button[title="Remove Assigned Manager"]');
  readonly confirmationModal = this.page.locator('div[name="confirmation-modal"]');
  readonly confirmUnassignButton = this.confirmationModal.locator("button.btn-danger");
  readonly selectManagerLink = this.page.locator("text=Click to select manager");
  private readonly modalContainer = this.page.locator(".modal-content");
  private readonly managerList = this.modalContainer.locator("#manager-list");
  private readonly managerListItems = this.modalContainer.locator(".list-group-item");
  private readonly saveManagerButton = this.modalContainer.locator('button:has-text("Save")');
  readonly cancelUnassignButton = this.confirmationModal.locator('button:has-text("Cancel")');

  // --- ЛОКАТОРЫ УПРАВЛЕНИЯ ЗАКАЗОМ ---
  readonly cancelOrderButton = this.orderDetailsHeader.locator("#cancel-order");
  readonly clicktoCancelOrder = this.page.getByRole("button", { name: /yes,\s*cancel/i });
  readonly refreshOrderButton = this.orderDetailsHeader.locator("#refresh-order");
  readonly processOrderButton = this.orderDetailsHeader.locator("#process-order");
  readonly reopenOrderButton = this.page.getByRole("button", { name: /reopen/i });
  readonly orderHistoryTab = this.page.getByRole("tab", { name: /order history/i });

  // --- ЛОКАТОРЫ ПРОДУКТОВ И КЛИЕНТА ---
  readonly orderItems = this.page.locator("#products-accordion-section button.accordion-button");
  readonly editItems = this.page.locator("#edit-products-pencil");
  readonly editCustomerButton = this.page.locator("#edit-customer-pencil");
  readonly editProductButton = this.page.locator("#edit-products-pencil");
  readonly productNames = this.page.locator("#products-accordion-section .accordion-button");
  readonly customerNameValue = this.page
    .locator("#customer-section")
    .locator(".c-details", { hasText: "Name" })
    .locator("span.s-span:not(.strong-details)");

    // --- ЛОКАТОРЫ КОММЕНТАРИЕВ ---
  readonly commentsTab = this.page.locator("#comments-tab"); // ID из консоли/инспектора
  readonly commentInput = this.page.locator('textarea[name="comments"]'); //
  readonly createCommentButton = this.page.locator('button:has-text("Create")');

  // --- ЛОКАТОРЫ УВЕДОМЛЕНИЙ (TOASTS) ---
  readonly toastMessage = this.page.locator("div.toast-body");
  readonly toastCloseButton = this.page.locator(".toast button.btn-close");

  // --- МЕТОДЫ СТРАНИЦЫ ---

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

  @logStep("Click 'Click to select manager' button")
  async clickSelectManager() {
    await this.clickToSelectManagerButton.click();
  }

  @logStep("Click Edit Manager (pencil icon)")
  async editManager() {
    await this.editManagerButton.waitFor({ state: "visible" });
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

  @logStep("Get delivery date")
  async getDeliveryDate() {
    return await this.delivery.innerText();
  }

  @logStep("Get created on")
  async getCreatedOn() {
    return await this.createdOn.innerText();
  }

  @logStep("Back to orders list")
  async backToOrdersList() {
    await this.backToOrdersLink.click();
  }

  @logStep("Get order item by name")
  async getOrderItemsByName(name: string) {
    return this.orderItems.filter({ hasText: name });
  }

  @logStep("Get order items texts")
  async getOrderItems() {
    return await this.orderItems.allInnerTexts();
  }

  @logStep("Edit order item")
  async editOrderItem() {
    await this.editItems.click();
  }

  @logStep("Click reopen order button")
  async clickReopenOrder() {
    await this.reopenOrderButton.click();
  }

  @logStep("Click edit Customer button")
  async clickEditCustomer() {
    await this.editCustomerButton.click();
    await this.editCustomerButton.waitFor({ state: "visible", timeout: 15000 });
  }

  @logStep("Click edit Product button")
  async clickEditProduct() {
    await this.editProductButton.click();
    await this.editProductButton.waitFor({ state: "visible", timeout: 20000 });
  }

  @logStep("Get all products names from orders")
  async getProductNames(): Promise<string[]> {
    const names = await this.productNames.allInnerTexts();
    return names.map(name => name.trim()).filter(name => name !== "");
  }

  @logStep("Check that the product named '{0}' is present in the list")
  async verifyProductInList(expectedName: string) {
    const productLocator = this.productNames.filter({ hasText: expectedName });
    await expect(productLocator).toBeVisible({ timeout: 7000 });
  }

  getToastByText(text: string) {
    return this.toastMessage.filter({ hasText: text });
  }

  @logStep("Verify toast message with text: {0}")
  async verifyToastMessage(expectedText: string) {
    const specificToast = this.getToastByText(expectedText);
    await expect(specificToast).toBeVisible();
  }

  @logStep("Close specific toast notification with text: {0}")
  async closeSpecificToast(text: string) {
    const specificToastContainer = this.page.locator(".toast", { hasText: text });
    const closeBtn = specificToastContainer.locator("button.btn-close");

    if (await closeBtn.isVisible()) {
      await closeBtn.click();
      await expect(specificToastContainer).toBeHidden();
    }
  }

  @logStep("Close first visible toast notification")
  async closeToastMessage() {
    if (await this.toastCloseButton.isVisible()) {
      await this.toastCloseButton.first().click();
      await expect(this.toastMessage.first()).toBeHidden();
    }
  }

  @logStep("Get assigned manager name from page header")
  async getAssignedManagerName(): Promise<string> {
    const fullName = await this.assignedManagerLink.innerText();
    if (!fullName) return "";

    return fullName.trim();
  }

  @logStep("Select manager from list by index: {index}")
  async selectManagerByIndex(index: number = 0) {
    const managerItem = this.managerListItems.nth(index);
    await managerItem.waitFor({ state: "visible" });
    await managerItem.click();
  }

  @logStep("Remove assigned manager and confirm")
  async removeManagerWithConfirmation() {
    await this.removeManagerIcon.click();
    await this.confirmationModal.waitFor({ state: "visible" });
    await this.confirmUnassignButton.click();
    await this.confirmationModal.waitFor({ state: "hidden" });
  }

  @logStep("Click Save button in Assign Manager modal")
  async clickSaveManager() {
    await this.saveManagerButton.click();
    await this.modalContainer.waitFor({ state: "hidden" });
  }

  @logStep("Click Cancel in unassign confirmation modal")
  async cancelManagerUnassignment() {
    await this.removeManagerIcon.click();
    await this.confirmationModal.waitFor({ state: "visible" });
    await this.cancelUnassignButton.click();
    await this.confirmationModal.waitFor({ state: "hidden" });
  }
}
