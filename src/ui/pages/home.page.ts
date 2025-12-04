import { Locator } from "@playwright/test";
import { SalesPortalPage } from "./sales-portal.page";

type HomeModuleButton = "Products" | "Customers" | "Orders";

export class HomePage extends SalesPortalPage {
  readonly welcomeText = this.page.locator(".welcome-text");
  readonly productsButton = this.page.locator("#products-from-home");
  readonly customersButton = this.page.locator("#customers-from-home");
  readonly ordersButton = this.page.locator("#orders-from-home");
  readonly uniqueElement = this.welcomeText;

  readonly ordersThisYear = this.page.locator("#total-orders-container p");
  readonly newCustomers = this.page.locator("#total-customers-container p");
  readonly canceledOrders = this.page.locator("#canceled-orders-container p");
  readonly totalRevenue = this.page.locator("#total-revenue-container p");
  readonly avgOrderValue = this.page.locator("#avg-orders-value-container p");

  async clickOnViewModule(module: HomeModuleButton) {
    const moduleButtons: Record<HomeModuleButton, Locator> = {
      Products: this.productsButton,
      Customers: this.customersButton,
      Orders: this.ordersButton,
    };

    await moduleButtons[module].click();
  }
  async getOrdersThisYearMetric(): Promise<number> {
    const text = await this.ordersThisYear.textContent();
    if (!text) {
      console.warn("Orders this year metric not found or empty");
      return 0;
    }
    return parseInt(text.trim(), 10);
  }

  async getNewCustomersMetric(): Promise<number> {
    const text = await this.newCustomers.textContent();
    return text ? parseInt(text.trim(), 10) : 0;
  }

  async getCanceledOrdersMetric(): Promise<number> {
    const text = await this.canceledOrders.textContent();
    return text ? parseInt(text.trim(), 10) : 0;
  }

  async getTotalRevenueMetric(): Promise<string> {
    const text = await this.totalRevenue.textContent();
    if (!text) {
      console.warn("Total revenue metric not found");
      return "0";
    }
    return text.trim().replace(/\s+/g, " ");
  }

  async getAvgOrderValueMetric(): Promise<string> {
    const text = await this.avgOrderValue.textContent();
    if (!text) {
      console.warn("Average order value metric not found");
      return "0";
    }
    return text.trim().replace(/\s+/g, " ");
  }
}
