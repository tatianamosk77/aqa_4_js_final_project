import { Locator } from "@playwright/test";
import { SalesPortalPage } from "./sales-portal.page";
import { logStep } from "utils/report/logStep.utils";
import { HeaderItem } from "data/types/header.types";

export class HeaderPage extends SalesPortalPage {
  uniqueElement = this.page.locator("#main-header");

  readonly moduleButtons: Record<HeaderItem, Locator> = {
    Customers: this.page.getByRole("link", { name: "Customers", exact: true }),
    Products: this.page.getByRole("link", { name: "Products", exact: true }),
    Orders: this.page.getByRole("link", { name: "Orders", exact: true }),
    Home: this.page.getByRole("link", { name: "Home", exact: true }),
    Managers: this.page.getByRole("link", { name: "Managers", exact: true }),
  };

  readonly notificationButton = this.page.locator("#notification-bell");
  readonly themeToggleButton = this.page.locator("#theme-toggle");
  readonly userMenuButton = this.page.locator("#user-menu-button");
  readonly signOutButton = this.page.locator("#signOut");

  @logStep("Click on module button in header")
  async clickModule(headerItem: HeaderItem) {
    const button = this.moduleButtons[headerItem];
    if (!button) {
      throw new Error(`No button found for module: ${headerItem}`);
    }
    await button.waitFor({ state: "visible" });
    await button.click();
  }

  @logStep("Click on notification bell")
  async openNotifications() {
    await this.notificationButton.click();
  }

  @logStep("Toggle theme")
  async toggleTheme() {
    await this.themeToggleButton.click();
  }

  @logStep("Open user menu")
  async openUserMenu() {
    await this.userMenuButton.click();
  }

  @logStep("Click sign out")
  async clickSignOut() {
    await this.signOutButton.click();
  }
}
