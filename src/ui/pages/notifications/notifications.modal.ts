import { Locator, Page, expect } from "@playwright/test";
import { logStep } from "utils/report/logStep.utils";

export class NotificationsModal {
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly items: Locator;
  readonly readAllButton: Locator;
  readonly bellButton: Locator;

  constructor(private readonly page: Page) {
    this.modal = page.locator("#notification-popover");
    this.modalTitle = this.modal.getByText(/notifications/i);
    this.items = this.modal.locator(
      '[data-testid="notification-item"], .notification-item, .toast, li'
    );
    this.readAllButton = this.modal.getByRole("button", { name: /read all/i });
    this.bellButton = this.page.locator("#notification-bell");
  }

  @logStep("Wait for Notifications modal opened")
  async waitForOpened() {
    await expect(this.modal).toBeVisible();
  }

  @logStep("Wait for Notifications modal closed")
  async waitForClosed() {
    await expect(this.modal).toBeHidden();
  }

  @logStep("Open Notifications")
  async open() {
    await this.bellButton.click();
    await this.waitForOpened();
  }

  @logStep("Close Notifications by bell toggle")
  async closeByBell() {
    await this.bellButton.click();
    await this.waitForClosed();
  }
}
