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
  readonly cancelOrder = this.orderDetailsHeader.locator("#cancel-order");
  readonly refreshOrderButton = this.orderDetailsHeader.locator("#refresh-order");
  readonly orderStatus = this.orderStatusBar.filter({ hasText: "Order Status" }); //todo
  readonly totalPrice = this.orderStatusBar.filter({ hasText: "Total Price" }); //todo
  readonly delivery = this.orderStatusBar.filter({ hasText: "Delivery" }); //todo
  readonly createdOn = this.orderStatusBar.filter({ hasText: "Created On" }); //todo

  readonly customerSection = this.page.locator("#customer-section");
  readonly editCustomerButton = this.customerSection.locator("#edit-customer-pencil");
  readonly customerData = this.customerSection.locator(".p-3");

  readonly productSection = this.page.locator("#products-section");
  readonly editProductButton = this.productSection.locator("#edit-products-pencil");
  readonly productData = this.productSection.locator("#products-accordion-section");

  readonly uniqueElement = this.title;

  // @logStep("Fill in product form to update")
  // async fillForm(productData: Partial<IProduct>) {
  //     if (productData.name) await this.nameInput.fill(productData.name);
  //     if (productData.manufacturer)
  //         await this.manufacturerSelect.selectOption(productData.manufacturer);
  //     if (productData.price) await this.priceInput.fill(productData.price.toString());
  //     if (productData.amount) await this.amountInput.fill(productData.amount.toString());
  //     if (productData.notes) await this.notesInput.fill(productData.notes);
  // }

  // @logStep("Click save button during update")
  // async clickSave() {
  //     await this.saveButton.click();
  // }
}
