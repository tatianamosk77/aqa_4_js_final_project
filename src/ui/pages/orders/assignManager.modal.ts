import { BaseModal } from "../base.modal";
import { BasePage } from "../base.page";
import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";

export class AssignManagerModal extends BaseModal {
  readonly uniqueElement = this.page.locator(".modal-content");

  readonly title = this.uniqueElement.locator("h5");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  // readonly saveButton = this.uniqueElement.locator("button.btn-primary");
  readonly saveButton = this.uniqueElement.locator("#update-manager-btn");
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

  @logStep("Click Save button on AssignManagerModal")
  async clickSave() {
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

  @logStep("Choose a different manager from the list")
  async chooseDifferentManager(): Promise<string> {
    await this.managerList.waitFor({ state: "visible" });
    
    const otherManagerLocator = this.managerItems.filter({ 
      hasNot: this.page.locator('.active') 
    }).first();
    
    if (await otherManagerLocator.count() === 0) {
      throw new Error("No other managers available to select");
    }

    const managerText = await otherManagerLocator.innerText();
    const managerName = this.extractManagerName(managerText);
    
    await otherManagerLocator.click();

    return managerName;
  }


  private extractManagerName(fullText: string): string {
    const namePart = fullText.split("(")[0];
    return namePart ? namePart.trim() : fullText.trim();
  }
}
