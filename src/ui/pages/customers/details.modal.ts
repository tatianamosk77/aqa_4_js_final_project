import { SalesPortalPage } from "../sales-portal.page";

export class CustomerDetailsModal extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#customer-info-container");

  // readonly title = this.uniqueElement.locator("h3");
  // readonly closeButton = this.uniqueElement.locator("button.btn-close");
  // readonly editButton = this.uniqueElement.locator("button.btn-primary");
  // readonly cancelButton = this.uniqueElement.locator("button.btn-secondary");

  // readonly productValue = this.uniqueElement.locator("p");

  // async clickClose() {
  //     await this.closeButton.click();
  // }

  // async clickCancel() {
  //     await this.cancelButton.click();
  // }

  // async clickEdit() {
  //     await this.editButton.click();
  // }

  // async getData(): Promise<IProductDetails> {
  //     const [name, amount, price, manufacturer, createdOn, notes] = await this.productValue.allInnerTexts();

  //     return {
  //         name: name!,
  //         amount: +amount!,
  //         price: +price!,
  //         manufacturer: manufacturer! as MANUFACTURERS,
  //         createdOn: createdOn!,
  //         notes: notes === "-" ? "" : notes!,
  //     };
  // }
}
