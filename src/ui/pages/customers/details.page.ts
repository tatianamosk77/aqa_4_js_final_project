import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";
import { COUNTRIES } from "data/salesPortal/customers/countries";
import { ICustomerDetails } from "data/types/customer.types";

export class CustomerDetailsPage extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#customer-info-container");

  readonly title = this.uniqueElement.locator("h3");
  readonly editButton = this.uniqueElement.locator("#edit-customer-pencil");
  readonly backButton = this.uniqueElement.locator(".back-link");
  readonly emailValue = this.uniqueElement.locator("#customer-email");
  readonly nameValue = this.uniqueElement.locator("#customer-name");
  readonly phoneValue = this.uniqueElement.locator("#customer-phone");
  readonly countryValue = this.uniqueElement.locator("#customer-country");
  readonly cityValue = this.uniqueElement.locator("#customer-city");
  readonly streetValue = this.uniqueElement.locator("#customer-street");
  readonly houseValue = this.uniqueElement.locator("#customer-house");
  readonly flatValue = this.uniqueElement.locator("#customer-flat");
  readonly createdOnValue = this.uniqueElement.locator("#customer-created-on");
  readonly notesValue = this.uniqueElement.locator("#customer-notes");

  readonly customerValue = this.uniqueElement.locator("p");

  @logStep("Click edit button on CustomersDetailsModal")
  async clickEdit() {
    await this.editButton.click();
  }

  @logStep("Click back button `Customers` on CustomersDetailsModal")
  async clickBack() {
    await this.backButton.click();
  }

  @logStep("Get data from CustomerDetailsModal")
  async getData(): Promise<ICustomerDetails> {
    // const [email, name, country, city, street, house, flat, phone, notes, createdOn] = await this.customerValue.allInnerTexts();
    const email = await this.emailValue.innerText();
    const name = await this.nameValue.innerText();
    const country = await this.countryValue.innerText();
    const city = await this.cityValue.innerText();
    const street = await this.streetValue.innerText();
    const house = await this.houseValue.innerText();
    const flat = await this.flatValue.innerText();
    const phone = await this.phoneValue.innerText();
    const notes = await this.notesValue.innerText();
    const createdOn = await this.createdOnValue.innerText();

    return {
      email: email!,
      name: name!,
      country: country! as COUNTRIES,
      city: city!,
      street: street!,
      house: +house!,
      flat: +flat!,
      phone: phone!,
      createdOn: createdOn!,
      notes: notes === "-" ? "" : notes!,
    };
  }
}

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
// }
