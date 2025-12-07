import { ICustomer } from 'data/types/customer.types';
import { SalesPortalPage } from '../sales-portal.page';
import { logStep } from 'utils/report/logStep.utils';

export class EditCustomerPage extends SalesPortalPage {
  readonly title = this.page.locator('h2.page-title-text');
  readonly emailInput = this.page.locator('#inputEmail');
  readonly nameInput = this.page.locator('#inputName');
  readonly countryInput = this.page.locator('#inputCountry');
  readonly streetInput = this.page.locator('#inputStreet');
  readonly flatInput = this.page.locator('#inputFlat');
  readonly cityInput = this.page.locator('#inputCity');
  readonly houseInput = this.page.locator('#inputHouse');
  readonly phoneInput = this.page.locator('#inputPhone');
  readonly notesInput = this.page.locator('#textareaNotes');
  readonly saveButton = this.page.locator('#save-customer-changes');
  readonly deleteButton = this.page.locator('#delete-customer-btn');
  readonly backButton = this.page.locator('#delete-customer-btn');
  readonly backCustomersButton = this.page.locator('.back-link', { hasText: 'Customers' });

  readonly uniqueElement = this.title;

  @logStep('Fill in customer form to update')
  async fillForm(customerData: Partial<ICustomer>) {
    if (customerData.name) await this.nameInput.fill(customerData.name);
    if (customerData.email) await this.emailInput.fill(customerData.email);
    if (customerData.city) await this.cityInput.fill(customerData.city);
    if (customerData.country) await this.countryInput.selectOption(customerData.country);
    if (customerData.flat) await this.flatInput.fill(customerData.flat.toString());
    if (customerData.house) await this.houseInput.fill(customerData.house.toString());
    if (customerData.street) await this.streetInput.fill(customerData.street);
    if (customerData.phone) await this.phoneInput.fill(customerData.phone);
    if (customerData.notes) await this.notesInput.fill(customerData.notes);
  }

  @logStep('Back to the Customers list page')
  async clickBackToCustomers() {
    await this.backCustomersButton.click();
  }

  @logStep('Click save button during update')
  async clickSave() {
    await this.saveButton.click();
  }

  @logStep('Click to Delete customer')
  async clickDelete() {
    await this.deleteButton.click();
  }
}
