import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";

export class AddNewOrderModal extends SalesPortalPage {
  readonly uniqueElement = this.page.locator(".modal-content");

  readonly title = this.uniqueElement.locator("h5");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  readonly createButton = this.uniqueElement.locator("button.btn-primary");
  readonly cancelButton = this.uniqueElement.locator("button.btn-secondary");

  readonly inputCustomerOrder = this.uniqueElement.locator("#inputCustomerOrder");
  readonly productRow = this.uniqueElement.locator('[name="Product"]');
  readonly addProductButton = this.uniqueElement.locator("#add-product-btn");
  readonly deleteProductButton = this.productRow.locator('[title="Delete"]');

  readonly totalPrice = this.uniqueElement.locator("#total-price-order-modal");

  @logStep("Click close button on AddNewOrderModal")
  async clickClose() {
    await this.closeButton.click();
  }

  @logStep("Click cancel button on AddNewOrderModal")
  async clickCancel() {
    await this.cancelButton.click();
  }

  @logStep("Click create button on AddNewOrderModal")
  async clickEdit() {
    await this.createButton.click();
  }

  @logStep("Click add product on AddNewOrderModal")
  async clickAddProduct() {
    await this.addProductButton.click();
  }

  @logStep("Click delete product on AddNewOrderModal")
  async clickDeleteProduct() {
    await this.deleteProductButton.click();
  }

  @logStep("Click customer on AddNewOrderModal")
  async clickCustomer() {
    await this.inputCustomerOrder.click();
  }

  @logStep("Click product on AddNewOrderModal")
  async clickProduct() {
    await this.productRow.click();
  }
}
