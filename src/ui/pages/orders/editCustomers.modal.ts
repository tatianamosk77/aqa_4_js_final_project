import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";

export class EditCustomerModal extends SalesPortalPage {
  readonly uniqueElement = this.page.locator(".modal-content");

  readonly title = this.uniqueElement.locator("h5");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  readonly saveButton = this.uniqueElement.locator("button.btn-primary");
  readonly cancelButton = this.uniqueElement.locator("button.btn-secondary");

  readonly inputCustomerOrder = this.uniqueElement.locator("#inputCustomerOrder");
  readonly customerItems = this.inputCustomerOrder.locator("option");

  @logStep("Click close button on EditCustomerModal")
  async clickClose() {
    await this.closeButton.click();
  }

  @logStep("Click cancel button on EditCustomerModal")
  async clickCancel() {
    await this.cancelButton.click();
  }

  @logStep("Click create button on EditCustomerModal")
  async clickEdit() {
    await this.saveButton.click();
  }
  @logStep("Click customer on EditCustomerModal")
  async clickCustomerDropdown() {
    await this.inputCustomerOrder.click();
  }

  @logStep("Select random customer")
  async selectRandomCustomer(): Promise<string> {
    await this.inputCustomerOrder.waitFor({ state: "visible" });
    await this.clickCustomerDropdown();

    const customerElements = await this.customerItems.all();

    if (customerElements.length === 0) {
      throw new Error("No customers found in the list");
    }

    const randomIndex = Math.floor(Math.random() * customerElements.length);
    const chosenCustomer = customerElements[randomIndex];

    const customerText = await chosenCustomer?.innerText();
    if (!customerText) {
      throw new Error("Customer element has no text");
    }
    const customerName = this.extractName(customerText);

    await chosenCustomer?.click();

    return customerName;
  }

  private extractName(fullText: string): string {
    if (!fullText) return "";

    const namePart = fullText.split("(")[0]?.trim();
    return namePart || fullText.trim();
  }
}
