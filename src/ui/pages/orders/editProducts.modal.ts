import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";

export class EditProductModal extends SalesPortalPage {
  readonly uniqueElement = this.page.locator(".modal-content");

  readonly title = this.uniqueElement.locator("h5");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  readonly createButton = this.uniqueElement.locator("button.btn-primary");
  readonly cancelButton = this.uniqueElement.locator("button.btn-secondary");

  readonly productDropdown = this.uniqueElement.locator('[name="Product"]');
  readonly productItems = this.productDropdown.locator("option");
  readonly productContainers = this.uniqueElement.locator("#edit-products-section");
  readonly productRows = this.productContainers.locator("[data-id]");

  readonly productNameInContainer = (productName: string) =>
    this.productContainers.filter({ hasText: productName });

  readonly deleteButtonForProduct = (productName: string) =>
    this.productNameInContainer(productName).locator('[title="Delete"]');

  readonly addProductButton = this.uniqueElement.locator("#add-product-btn");
  readonly deleteProductButton = this.uniqueElement.locator('[title="Delete"]');

  readonly totalPrice = this.uniqueElement.locator("#total-price-order-modal");

  @logStep("Click close button on EditProductModal")
  async clickClose() {
    await this.closeButton.click();
  }

  @logStep("Click cancel button on EditProductModal")
  async clickCancel() {
    await this.cancelButton.click();
  }

  @logStep("Click create button on EditProductModal")
  async clickEdit() {
    await this.createButton.click();
  }

  @logStep("Click add product on EditProductModal")
  async clickAddProduct() {
    await this.addProductButton.click();
  }

  @logStep("Click delete product on EditProductModal")
  async clickDeleteProduct() {
    await this.deleteProductButton.click();
  }

  @logStep("Click product dropdown on EditProductModal")
  async clickProductDropdown(indexOrName: number | string = 0) {
    const dropdown = this.productDropdownBy(indexOrName);
    await dropdown.click();
  }

  @logStep("Delete specific product by name")
  async deleteProductByName(productName: string): Promise<void> {
    const deleteButton = this.deleteButtonForProduct(productName);
    await deleteButton.click();
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

  productContainerBy(indexOrName: number | string) {
    if (typeof indexOrName === "number") {
      return this.productRows.nth(indexOrName);
    } else {
      return this.productContainers.filter({ hasText: indexOrName });
    }
  }

  deleteButtonBy(indexOrName: number | string) {
    const container = this.productContainerBy(indexOrName);
    return container.locator('[title="Delete"]');
  }

  productDropdownBy(indexOrName: number | string) {
    if (typeof indexOrName === "number") {
      return this.productDropdown.nth(indexOrName);
    } else {
      const container = this.productContainerBy(indexOrName);
      return container.locator('[name="Product"]');
    }
  }

  @logStep("Delete specific product by name or index")
  async deleteProduct(indexOrName: number | string): Promise<void> {
    const deleteButton = this.deleteButtonBy(indexOrName);
    await deleteButton.click();
  }

  @logStep("Get product count")
  async getProductCount(): Promise<number> {
    return await this.productRows.count();
  }

  @logStep("Select product by index or name")
  async selectProduct(
    indexOrName: number | string,
    productToSelect: string | number
  ): Promise<string> {
    await this.clickProductDropdown(indexOrName);

    const dropdown = this.productDropdownBy(indexOrName);

    if (typeof productToSelect === "number") {
      const options = await dropdown.locator("option").all();
      if (productToSelect >= 0 && productToSelect < options.length) {
        await options[productToSelect]!.click();
        const selectedText = await options[productToSelect]!.innerText();
        return this.extractName(selectedText);
      }
      throw new Error(`Product index ${productToSelect} is out of bounds`);
    } else {
      await dropdown.selectOption({ label: productToSelect });
      return productToSelect;
    }
  }

  @logStep("Select random product for specific position")
  async selectRandomProductFor(indexOrName: number | string = 0): Promise<string> {
    await this.clickProductDropdown(indexOrName);

    const dropdown = this.productDropdownBy(indexOrName);
    await dropdown.waitFor({ state: "visible" });

    const productElements = await dropdown.locator("option").all();

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

  @logStep("Get current product name by index or name")
  async getProductName(indexOrName: number | string): Promise<string> {
    const container = this.productContainerBy(indexOrName);
    const text = await container.innerText();
    return this.extractName(text);
  }

  @logStep("Get all product names")
  async getAllProductNames(): Promise<string[]> {
    const count = await this.getProductCount();
    const names: string[] = [];

    for (let i = 0; i < count; i++) {
      const name = await this.getProductName(i);
      names.push(name);
    }

    return names;
  }
  @logStep("Get total price value")
  async getTotalPriceValue(): Promise<string> {
    return await this.totalPrice.innerText();
  }

  @logStep("Get total price as number")
  async getTotalPriceNumber(): Promise<number> {
    const priceText = await this.getTotalPriceValue();
    const numbers = priceText.replace(/[^\d.,]/g, "");
    const cleanNumber = numbers.replace(",", ".");
    return parseFloat(cleanNumber) || 0;
  }
}
