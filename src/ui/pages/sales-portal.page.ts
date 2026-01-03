import { expect, Locator } from "@playwright/test";
import { BasePage } from "./base.page";
import { SALES_PORTAL_URL, TIMEOUTS } from "config/env";
import { logStep } from "utils/report/logStep.utils";

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
    await expect(this.spinner).toHaveCount(0, { timeout: TIMEOUTS.ELEMENT_VISIBLE });
  }

  @logStep("Open page")
  async open(route = "") {
    await this.page.goto(SALES_PORTAL_URL + route);
  }

  @logStep("Wait for toast")
  async waitForToast(notification: string) {
    await expect(this.toastMessage).toHaveText(notification);
    await this.closeToast();
    await expect(this.toastMessage).not.toBeVisible();
  }

  @logStep("Click toast")
  async closeToast() {
    await this.closeToastButton.click();
  }

  async openPortal() {
    await this.page.goto(SALES_PORTAL_URL);
  }

  // async openPage(page: keyof typeof ROUTES, id?: string) {
  //   const route = ROUTES[page];

  //   if (!route) {
  //     throw new Error(`Route "${String(page)}" is not defined`);
  //   }

  //   const target =
  //     typeof route === "string"
  //       ? route
  //       : (() => {
  //           if (!id) throw new Error("Id was not provided");
  //           return route(id);
  //         })();

  //   if (!target.includes("#/")) {
  //     const base = SALES_PORTAL_URL.replace(/#.*/, "").replace(/\/+$/, "");
  //     const path = target.replace(base, "");
  //     const normalizedPath = `/${path.replace(/^\/+/, "")}`;
  //     await this.page.goto(`${base}#${normalizedPath}`);
  //     return;
  //   }

  //   await this.page.goto(target);
  // }
}
