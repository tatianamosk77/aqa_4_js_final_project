import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";
import { expect } from "@playwright/test";


export class EditCustomerModal extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#edit-customer-modal");

  readonly title = this.uniqueElement.locator("h5");
  readonly closeButton = this.uniqueElement.locator("button.btn-close");
  readonly saveButton = this.uniqueElement.locator("#update-customer-btn");
  // readonly saveButton = this.uniqueElement.locator("button.btn-primary");
  // Локатор для синего спиннера, который на кнопке
  readonly spinner = this.uniqueElement.locator(".spinner-border");
  readonly cancelButton = this.uniqueElement.locator("button.btn-secondary");

  // Локатор ипута кастомера в модалке Edit Customer
  readonly inputCustomerOrder = this.uniqueElement.locator("#inputCustomerOrder");
  readonly customerItems = this.inputCustomerOrder.locator("option");

   // Локатор для опции, которая выбрана в данный момент
   readonly selectedCustomerOption = this.inputCustomerOrder.locator("option[selected]");

  @logStep("Click close button on EditCustomerModal")
  async clickClose() {
    await this.closeButton.click();
  }

  @logStep("Click cancel button on EditCustomerModal")
  async clickCancel() {
    await this.cancelButton.click();
  }

  // @logStep("Click create button on EditCustomerModal")
  // async clickEdit() {
  //   await this.saveButton.click();
  // }

  @logStep("Click customer on EditCustomerModal")
  async clickCustomerDropdown() {
    await this.inputCustomerOrder.click();
  }

  @logStep("Select customer by name")
  async selectCustomer(name: string) {
  await this.inputCustomerOrder.selectOption({ label: name }); 
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


  @logStep("Select other customer from dropdown and return its name")
  async selectOtherCustomer(): Promise<string> {
  
  await this.inputCustomerOrder.waitFor({ state: "visible" });
  
  let selectedText = "";
  if (await this.selectedCustomerOption.count() > 0) {
    selectedText = (await this.selectedCustomerOption.innerText()).trim();
  }

  const allOptions = await this.customerItems.allInnerTexts();

 const filteredOptions = allOptions.filter(opt => 
    opt.trim() !== "" && opt.trim() !== selectedText
  );

  if (filteredOptions.length === 0) {
    throw new Error("No other customers found in dropdown to select");
  }

  const randomIndex = Math.floor(Math.random() * filteredOptions.length);
  const chosenFullText = filteredOptions[randomIndex];

  if (!chosenFullText) throw new Error("Selected text is null");

  await this.inputCustomerOrder.selectOption({ label: chosenFullText });
  return this.extractName(chosenFullText);
}
 

 @logStep("Click save button on EditCustomerModal")
  async clickEdit() {
    await this.saveButton.click();
    await this.spinner.waitFor({ state: 'hidden', timeout: 10000 });   
  }

  @logStep("Wait for Edit Customer modal to close")
  async waitForClosed() {
    await this.uniqueElement.waitFor({ state: "hidden", timeout: 20000 });
    await expect(this.uniqueElement).toBeHidden();
  }

}