import { expect } from "fixtures";
import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";

export class EditProductModal extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#edit-products-modal");

  readonly title = this.uniqueElement.locator("h5");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  readonly createButton = this.uniqueElement.locator("button.btn-primary");
  readonly saveButton = this.uniqueElement.locator("#update-products-btn");
  readonly cancelButton = this.uniqueElement.locator("button.btn-secondary");
  // Локатор ипута Продукта в модалке Edit Products
  readonly productDropdown = this.uniqueElement.locator("select.form-select[name='Product']");
  readonly productItems = this.productDropdown.locator("option");
  // Локатор для опции, которая выбрана в данный момент
  readonly selectedProductOption = this.productDropdown.locator("option[selected]");

  readonly productContainers = this.uniqueElement.locator("#edit-products-section");
  readonly productRows = this.productContainers.locator("div[data-id]"); // Конкретные строки

  readonly productNameInContainer = (productName: string) =>
    this.productContainers.filter({ hasText: productName });

  readonly deleteButtonForProduct = (productName: string) =>
    this.productNameInContainer(productName).locator('[title="Delete"]');

  readonly deleteProductButton = this.page.locator("button.del-btn-modal");

  readonly addProductButton = this.uniqueElement.locator("#add-product-btn");
  // readonly deleteProductButton = this.uniqueElement.locator('[title="Delete"]');

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

  @logStep("Add new product row and select a random item")
  async addProductAndSelectRandom(): Promise<string> {
    const initialCount = await this.getProductDropdownsCount();
    await this.clickAddProduct();
    const newDropdown = this.productDropdown.nth(initialCount);
    await expect(newDropdown).toBeVisible({ timeout: 5000 });
    return await this.selectOtherProduct(initialCount);
  }

  @logStep("Click add Product on EditProductModal")
  async clickAddProduct() {
      await this.addProductButton.scrollIntoViewIfNeeded();
      await this.addProductButton.click({ force: true });
  }

  @logStep("Get current product name by index")
  async getProductName(index: number): Promise<string> {
    const dropdown = this.productDropdown.nth(index);
    const text = await dropdown.locator("option:checked").innerText();
    return this.extractName(text);
  }

  @logStep("Click delete product on EditProductModal")
  async clickDeleteProduct() {
    await this.deleteProductButton.click();
  }

  @logStep("Click Random delete product button on EditProductModal")
  async clickRandomDeleteButton() {
    await this.deleteProductButton.first().waitFor({ state: "visible" });
    const count = await this.deleteProductButton.count();

    if (count === 0) {
      throw new Error("Button to delete are not found");
    }

    const randomIndex = Math.floor(Math.random() * count);
    await this.deleteProductButton.nth(randomIndex).click();
  }

  @logStep("Click product dropdown")
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
      return this.productRows.filter({
        has: this.page.locator('select[name="Product"]'),
        hasText: indexOrName,
      });
    }
  }

  deleteButtonBy(indexOrName: number | string) {
    const container = this.productContainerBy(indexOrName);
    return container.locator("button.del-btn-modal").first();
  }

  productDropdownBy(indexOrName: number | string) {
    if (typeof indexOrName === "number") {
      return this.productDropdown.nth(indexOrName);
    } else {
      const container = this.productContainerBy(indexOrName);
      return container.locator('select[name="Product"]');
    }
  }

  @logStep("Delete specific product by name or index")
  async deleteProduct(indexOrName: number | string): Promise<void> {
    const count = await this.productRows.count();
    if (count <= 1) {
      throw new Error("Unable to delete product: at least one product must be in the list.");
    }
    const deleteButton = this.deleteButtonBy(indexOrName);
    // Используем force: true, так как элемент может быть перекрыт или скрыт скроллом
    await deleteButton.click({ force: true });
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

  // @logStep("Get current product name by index or name")
  // async getProductName(indexOrName: number | string): Promise<string> {
  //   const container = this.productContainerBy(indexOrName);
  //   const text = await container.innerText();
  //   return this.extractName(text);
  // }

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

  @logStep("Выбрать другой продукт из выпадающего списка")
  async selectOtherProduct(index: number = 0): Promise<string> {
    const dropdown = this.productDropdown.nth(index);
    await dropdown.waitFor({ state: "visible" });

    // Находим текущее значение, чтобы не выбрать его повторно
    const selectedText = await dropdown.locator("option:checked").innerText();

    const allOptions = await dropdown.locator("option").allInnerTexts();
    const filteredOptions = allOptions.filter(
      opt => opt.trim() !== "" && opt.trim() !== selectedText.trim()
    );

    if (filteredOptions.length === 0) {
      throw new Error("No other available products were found to select.");
    }

    const randomIndex = Math.floor(Math.random() * filteredOptions.length);
    const chosenFullText = filteredOptions[randomIndex];

    if (!chosenFullText) throw new Error("Unable to get product name");

    await dropdown.selectOption({ label: chosenFullText });
    return chosenFullText;
  }

  @logStep("Select a product that is not yet in the order list")
  async selectUniqueProduct(index: number): Promise<string> {
    const dropdown = this.productDropdown.nth(index);
    await dropdown.waitFor({ state: "visible" });

    const allSelectedOptions = await this.productDropdown.locator("option:checked").allInnerTexts();
    const alreadyChosenNames = allSelectedOptions.map(name => name.trim());
    console.log(`We exclude already selected products: [${alreadyChosenNames.join(", ")}]`);

    const allOptions = await dropdown.locator("option").allInnerTexts();
    const uniqueOptions = allOptions.filter(
      opt => opt.trim() !== "" && !alreadyChosenNames.includes(opt.trim())
    );

    console.log(`Unique products available to choose from: ${uniqueOptions.length}`);

    if (uniqueOptions.length === 0) {
      throw new Error(
        "No unique products found. All items from the list have already been added to your order."
      );
    }

    const randomIndex = Math.floor(Math.random() * uniqueOptions.length);
    const chosenProduct = uniqueOptions[randomIndex];

    if (!chosenProduct) {
      throw new Error("Error selecting a product from an array of unique options.");
    }

    console.log(`A unique product has been selected: ${chosenProduct}`);
    await dropdown.selectOption(chosenProduct);
    return this.extractName(chosenProduct);
  }

  @logStep("Add new product row and select a UNIQUE item")
  async addProductAndSelectUnique(): Promise<string> {
    const initialCount = await this.getProductDropdownsCount();
    await this.clickAddProduct();
    await expect(this.productDropdown.nth(initialCount)).toBeVisible();

    return await this.selectUniqueProduct(initialCount);
  }

  @logStep("Get total number of product dropdowns in modal")
  async getProductDropdownsCount(): Promise<number> {
    return await this.productDropdown.count();
  }

  @logStep("Wait for Edit Product modal to close")
  async waitForClosed() {
    await this.uniqueElement.waitFor({ state: "hidden", timeout: 20000 });
    await expect(this.uniqueElement).toBeHidden();
  }

  @logStep("Click Save button")
  async clickSave() {
    await expect(this.saveButton).toBeEnabled({ timeout: 10000 });
    await this.saveButton.click();
  }
}
