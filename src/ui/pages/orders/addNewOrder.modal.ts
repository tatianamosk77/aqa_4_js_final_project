import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";

export class AddNewOrderModal extends SalesPortalPage {
  readonly uniqueElement = this.page.locator(".modal-content");

  readonly title = this.uniqueElement.locator("h5");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  readonly createButton = this.uniqueElement.locator("button.btn-primary");
  readonly cancelButton = this.uniqueElement.locator("button.btn-secondary");

  readonly customerDropdown = this.uniqueElement.locator("#inputCustomerOrder");
  readonly customerItems = this.customerDropdown.locator("option");
  readonly productDropdown = this.uniqueElement.locator('[name="Product"]');
  readonly productItems = this.customerDropdown.locator("option");

  readonly addProductButton = this.uniqueElement.locator("#add-product-btn");
  readonly deleteProductButton = this.productDropdown.locator('[title="Delete"]');

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
  async clickCustomerDropdown() {
    await this.customerDropdown.click();
  }

  @logStep("Click product on AddNewOrderModal")
  async clickProductDropdown() {
    await this.productDropdown.nth(-1).click();
  }

  @logStep("Select random customer")
  async selectRandomCustomer(): Promise<string> {
    await this.customerDropdown.waitFor({ state: "visible" });
    await this.clickCustomerDropdown();

    const customerElements = await this.customerItems.all();

    if (customerElements.length === 0) {
      throw new Error("No customers found in the list");
    }

    const randomIndex = Math.floor(Math.random() * customerElements.length);
    const chosenCustomer = customerElements[randomIndex];

    const customerText = await chosenCustomer?.innerText();
    if (!customerText) {
      throw new Error("Customer element has no text");
    }
    const customerName = this.extractName(customerText);

    await chosenCustomer?.click();

    return customerName;
  }

  @logStep("Select random product")
  async selectRandomProduct(): Promise<string> {
    await this.productDropdown.waitFor({ state: "visible" });
    await this.clickProductDropdown();

    const productElements = await this.productItems.all();

    if (productElements.length === 0) {
      throw new Error("No products found in the list");
    }

    const randomIndex = Math.floor(Math.random() * productElements.length);
    const chosenProduct = productElements[randomIndex];

    const productText = await chosenProduct?.innerText();
    if (!productText) {
      throw new Error("Product element has no text");
    }
    const productName = this.extractName(productText);

    await chosenProduct?.click();
    return productName;
  }

  private extractName(fullText: string): string {
    if (!fullText) return "";

    const namePart = fullText.split("(")[0]?.trim();
    return namePart || fullText.trim();
  }
}
