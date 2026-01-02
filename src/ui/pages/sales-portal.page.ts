import { expect, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { SALES_PORTAL_URL, TIMEOUTS } from "config/env";
import { logStep } from "utils/report/logStep.utils";
import { ROUTES } from "config/uiConfig";

export abstract class SalesPortalPage extends BasePage {
  readonly spinner = this.page.locator(".spinner-border");
  readonly toastMessage = this.page.locator(".toast-body");
  readonly closeToastButton = this.page.locator("#toast button");

  abstract readonly uniqueElement: Locator;

  @logStep("Wait for unique element opened")
  async waitForOpened() {
    await expect(this.uniqueElement).toBeVisible({ timeout: TIMEOUTS.ELEMENT_VISIBLE });
    await this.waitForSpinners();
  }

  @logStep("Wait for spinner")
  async waitForSpinners() {
    await expect(this.spinner.first()).toBeHidden({timeout: TIMEOUTS.ELEMENT_VISIBLE });
  }

  @logStep("Click toast")
  async closeToast() {
    await this.closeToastButton.click();
  }

  async openPortal() {
    await this.page.goto(SALES_PORTAL_URL);
  }

  private normalizeHash(url: string): string {
    return url.replace(/#\/+/, "#/");
  }

  async openPage(page: keyof typeof ROUTES, id?: string) {
    const route = ROUTES[page];

    if (!route) {
      throw new Error(`Route "${String(page)}" is not defined`);
    }

    const target =
      typeof route === "string"
        ? route
        : (() => {
            if (!id) throw new Error("Id was not provided");
            return route(id);
          })();

    const base = SALES_PORTAL_URL.replace(/#.*/, "").replace(/\/+$/, "");

    if (target.includes("#/")) {
      await this.page.goto(this.normalizeHash(target));
      return;
    }

    const path = target.replace(base, "").replace(/^\/+/, "");
    const url = `${base}#/${path}`;

    await this.page.goto(this.normalizeHash(url));
  }
}

