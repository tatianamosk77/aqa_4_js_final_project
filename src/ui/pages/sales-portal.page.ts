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

  @logStep("Click toast")
  async closeToast() {
    await this.closeToastButton.click();
  }
}
