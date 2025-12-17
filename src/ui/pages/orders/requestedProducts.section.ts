import { Locator } from "@playwright/test";
import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";

export class RequestedProductsSection extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#products-section");

  readonly dataContainer = this.uniqueElement.locator("#products-accordion-section");
  readonly editProductsButton = this.uniqueElement.locator("#edit-products-pencil");

  readonly productExpandButtons = this.dataContainer.locator("[type='button']"); //click
  readonly productRows = this.dataContainer.locator(".accordion-header");
  readonly productStatuses = this.dataContainer.locator(".received-label");
  readonly expandedProductContainers = this.dataContainer.locator(".show");

  @logStep("Click edit products button in the order")
  async clickEditProducts() {
    await this.editProductsButton.click();
  }

  @logStep("Expand product in the order")
  async clickOnProduct() {
    await this.productExpandButtons.click();
  }

  productRowBy(indexOrName: number | string): Locator {
    if (typeof indexOrName === "number") {
      return this.productRows.nth(indexOrName);
    } else {
      return this.productRows.filter({ hasText: indexOrName });
    }
  }

  productExpandButtonBy(indexOrName: number | string): Locator {
    if (typeof indexOrName === "number") {
      return this.productExpandButtons.nth(indexOrName);
    } else {
      const row = this.productRowBy(indexOrName);
      return row.locator("[type='button']");
    }
  }

  productStatusBy(indexOrName: number | string): Locator {
    if (typeof indexOrName === "number") {
      return this.productStatuses.nth(indexOrName);
    } else {
      const row = this.productRowBy(indexOrName);
      return row.locator(".received-label");
    }
  }

  productInfoContainerBy(indexOrName: number | string): Locator {
    if (typeof indexOrName === "number") {
      return this.expandedProductContainers.nth(indexOrName);
    } else {
      return this.expandedProductContainers.filter({
        has: this.page
          .locator(".strong-details", { hasText: "Name" })
          .locator("..")
          .locator("span:nth-child(2)", { hasText: indexOrName }),
      });
    }
  }

  @logStep("Expand product in the order")
  async expandProduct(indexOrName: number | string = 0) {
    const button = this.productExpandButtonBy(indexOrName);
    await button.click();
  }

  @logStep("Collapse product in the order")
  async collapseProduct(indexOrName: number | string = 0) {
    const button = this.productExpandButtonBy(indexOrName);
    await button.click();
  }

  @logStep("Get product status")
  async getProductStatus(indexOrName: number | string = 0): Promise<string> {
    const statusElement = this.productStatusBy(indexOrName);
    return await statusElement.innerText();
  }

  @logStep("Get product name from list")
  async getProductNameFromList(index: number = 0): Promise<string> {
    const rowText = await this.productRows.nth(index).innerText();
    const status = await this.getProductStatus(index);
    return rowText.replace(status, "").trim();
  }

  @logStep("Get product details from expanded section")
  async getProductDetails(indexOrName: number | string = 0): Promise<Record<string, string>> {
    await this.expandProduct(indexOrName);

    const productInfo: Record<string, string> = {};
    const container = this.productInfoContainerBy(indexOrName);

    const labels = await container.locator(".strong-details").all();

    for (const label of labels) {
      try {
        const key = await label.innerText();
        const parent = label.locator("..");
        const value = await parent
          .locator("span:nth-child(2)")
          .innerText()
          .catch(() => "");

        if (key && key.trim()) {
          const cleanKey = key.trim().replace(/:\s*$/, "").replace("**", "");
          productInfo[cleanKey] = value.trim();
        }
      } catch (error) {
        console.warn("Ошибка при получении деталей продукта:", error);
      }
    }

    return productInfo;
  }

  @logStep("Get structured product data")
  async getProductData(indexOrName: number | string = 0): Promise<{
    name: string;
    price: string;
    manufacturer: string;
    notes: string;
    status: string;
  }> {
    const details = await this.getProductDetails(indexOrName);
    const status = await this.getProductStatus(indexOrName);

    return {
      name: details["Name"] || "",
      price: details["Price"] || "",
      manufacturer: details["Manufacturer"] || "",
      notes: details["Notes"] || "-",
      status: status,
    };
  }

  @logStep("Get all products data")
  async getAllProductsData(): Promise<
    Array<{
      index: number;
      name: string;
      status: string;
      details: Record<string, string>;
    }>
  > {
    const productsData = [];
    const productCount = await this.productRows.count();

    for (let i = 0; i < productCount; i++) {
      const name = await this.getProductNameFromList(i);
      const status = await this.getProductStatus(i);

      let details: Record<string, string> = {};
      try {
        details = await this.getProductDetails(i);
        await this.collapseProduct(i);
      } catch (error) {
        console.warn(`Не удалось получить детали продукта ${i}:`, error);
      }

      productsData.push({
        index: i,
        name,
        status,
        details,
      });
    }

    return productsData;
  }

  @logStep("Find product by name")
  async findProductByName(productName: string): Promise<{
    index: number;
    name: string;
    status: string;
    details: Record<string, string>;
  } | null> {
    const productCount = await this.productRows.count();

    for (let i = 0; i < productCount; i++) {
      const name = await this.getProductNameFromList(i);
      if (name.includes(productName)) {
        const status = await this.getProductStatus(i);
        const details = await this.getProductDetails(i);

        return {
          index: i,
          name,
          status,
          details,
        };
      }
    }

    return null;
  }
  async getAllProductsDetails(): Promise<Record<string, string>> {
    const customerInfo: Record<string, string> = {};

    const rows = await this.dataContainer.locator(".strong-details").all();

    for (const row of rows) {
      try {
        const key = await row.innerText();

        const value = await row.evaluate(element => {
          const parent = element.parentElement;
          if (parent) {
            const valueSpan = parent.querySelector("span:nth-child(2)");
            return valueSpan?.textContent?.trim() || "";
          }
          return "";
        });

        if (key && key.trim()) {
          const cleanKey = key.trim().replace(/:\s*$/, "");
          customerInfo[cleanKey] = value;
        }
      } catch (error) {
        console.warn("Ошибка при получении строки:", error);
      }
    }

    return customerInfo;
  }
}
