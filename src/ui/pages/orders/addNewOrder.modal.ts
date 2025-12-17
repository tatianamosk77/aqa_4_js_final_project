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
  readonly productItems = this.productDropdown.locator("option");
  readonly productContainers = this.uniqueElement.locator("#products-section");
  readonly productRows = this.productContainers.locator("[data-id]");

  readonly productNameInContainer = (productName: string) =>
    this.productContainers.filter({ hasText: productName });

  readonly deleteButtonForProduct = (productName: string) =>
    this.productNameInContainer(productName).locator('[title="Delete"]');

  readonly addProductButton = this.uniqueElement.locator("#add-product-btn");
  readonly deleteProductButton = this.uniqueElement.locator('[title="Delete"]');

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

  @logStep("Delete specific product by name")
  async deleteProductByName(productName: string): Promise<void> {
    const deleteButton = this.deleteButtonForProduct(productName);
    await deleteButton.click();
  }

  @logStep("Select customer by index or name")
  async selectCustomer(indexOrName: number | string): Promise<string> {
    if (typeof indexOrName === "number") {
      return await this.selectCustomerByIndex(indexOrName);
    } else {
      return await this.selectCustomerByName(indexOrName);
    }
  }

  @logStep("Select customer by index")
  async selectCustomerByIndex(index: number): Promise<string> {
    await this.customerDropdown.waitFor({ state: "visible" });

    const options = await this.customerItems.all();
    if (index < 0 || index >= options.length) {
      throw new Error(`Customer index ${index} is out of bounds`);
    }

    const optionText = await options[index]!.innerText();
    const customerName = this.extractName(optionText);

    await this.customerDropdown.selectOption({ index });
    return customerName;
  }

  @logStep("Select customer by name")
  async selectCustomerByName(customerName: string): Promise<string> {
    await this.customerDropdown.waitFor({ state: "visible" });
    await this.customerDropdown.selectOption({ label: customerName });
    return customerName;
  }

  @logStep("Select random customer")
  async selectRandomCustomer(): Promise<string> {
    await this.customerDropdown.waitFor({ state: "visible" });

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

  @logStep("Get selected customer name")
  async getSelectedCustomer(): Promise<string> {
    const selectedValue = await this.customerDropdown.inputValue();
    const selectedOption = this.customerItems.filter({ value: selectedValue });

    if ((await selectedOption.count()) > 0) {
      const text = await selectedOption.innerText();
      return this.extractName(text);
    }

    return "";
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

  @logStep("Select product by position and product name/index")
  async selectProduct(
    position: number | string,
    productToSelect: string | number
  ): Promise<string> {
    const dropdown = this.productDropdownBy(position);
    await dropdown.click();

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
  async selectRandomProductFor(position: number | string = 0): Promise<string> {
    const dropdown = this.productDropdownBy(position);
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

  @logStep("Get current product name by position")
  async getProductName(position: number | string): Promise<string> {
    const container = this.productContainerBy(position);
    const text = await container.innerText();
    return this.extractName(text);
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

  private extractName(fullText: string): string {
    if (!fullText) return "";

    const namePart = fullText.split("(")[0]?.trim();
    return namePart || fullText.trim();
  }

  @logStep("Fill order form")
  async fillOrderForm(options: {
    customer?: string | number;
    products?: Array<string | number>;
  }): Promise<{
    customerName: string;
    productNames: string[];
    totalPrice: number;
  }> {
    let customerName = "";
    const productNames: string[] = [];

    if (options.customer !== undefined) {
      customerName = await this.selectCustomer(options.customer);
    }

    if (options.products && options.products.length > 0) {
      for (let i = 0; i < options.products.length; i++) {
        if (i > 0) {
          await this.clickAddProduct();
        }
        const productName = await this.selectProduct(i, options.products[i]!);
        productNames.push(productName);
      }
    }

    const totalPrice = await this.getTotalPriceNumber();

    return {
      customerName,
      productNames,
      totalPrice,
    };
  }
}
