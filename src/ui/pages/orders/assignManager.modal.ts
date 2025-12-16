import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";

export class AssignManagerModal extends SalesPortalPage {
  readonly uniqueElement = this.page.locator(".modal-content");

  readonly title = this.uniqueElement.locator("h5");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  readonly saveButton = this.uniqueElement.locator("button.btn-primary");
  readonly cancelButton = this.uniqueElement.locator("button.btn-secondary");

  readonly inputCustomerOrder = this.uniqueElement.locator("#inputCustomerOrder");
  readonly managerSearchInput = this.uniqueElement.locator("#manager-search-input");

  readonly managerList = this.uniqueElement.locator("#manager-list");
  readonly managerItems = this.managerList.locator(".list-group-item");
  readonly managerByName = (name: string) => this.managerItems.filter({ hasText: name });

  @logStep("Click close button on AssignManagerModal")
  async clickClose() {
    await this.closeButton.click();
  }

  @logStep("Click cancel button on AssignManagerModal")
  async clickCancel() {
    await this.cancelButton.click();
  }

  @logStep("Click create button on AssignManagerModal")
  async clickEdit() {
    await this.saveButton.click();
  }

  @logStep("Search manager on AssignManagerModal")
  async searchManager(managerName: string) {
    await this.managerSearchInput.fill(managerName);
  }

  @logStep("Get manager list on AssignManagerModal")
  async getManagerList() {
    await this.managerList.waitFor({ state: "visible" });
    return this.managerItems;
  }

  @logStep("Choose a random manager from the list")
  async chooseRandomManager(): Promise<string> {
    await this.managerList.waitFor({ state: "visible" });
    const managerElements = await this.managerItems.all();

    if (managerElements.length === 0) {
      throw new Error("No managers found in the list");
    }

    const randomIndex = Math.floor(Math.random() * managerElements.length);
    const chosenManager = managerElements[randomIndex];

    const managerText = await chosenManager?.innerText();

    if (!managerText) {
      throw new Error("Manager element has no text");
    }
    const managerName = this.extractManagerName(managerText);

    await chosenManager?.click();

    return managerName;
  }

  private extractManagerName(fullText: string): string {
    const namePart = fullText.split("(")[0]?.trim();
    return namePart || fullText.trim();
  }
}
