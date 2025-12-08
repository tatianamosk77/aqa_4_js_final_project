import { expect } from '@playwright/test';
import { ICustomerDetails } from 'data/types/customer.types';
import _ from 'lodash';
import { AddNewCustomerPage, CustomerDetailsPage, CustomersListPage } from 'ui/pages/customers';
import { convertToDateAndTime } from 'utils/date.utils';
import { logStep } from 'utils/report/logStep.utils';

export class CustomersListUIService {
  constructor(
    private customersListPage: CustomersListPage,
    private addNewCustomerPage: AddNewCustomerPage,
    private customersDetailsPage: CustomerDetailsPage
  ) {}

  @logStep('Open Add new customer page')
  async openAddNewCustomerPage() {
    await this.customersListPage.clickAddNewCustomer();
    await this.addNewCustomerPage.waitForOpened();
  }

  @logStep('Open customer details')
  async openDetailsCustomersPage(customerEmail: string) {
    await this.customersListPage.detailsButton(customerEmail).click();
    await this.customersDetailsPage.waitForOpened();
  }

  @logStep('Open customer delete modal')
  async openDeleteModal(customerEmail: string) {
    await this.customersListPage.clickAction(customerEmail, 'delete');
    await this.customersListPage.deleteModal.waitForOpened();
  }

  @logStep('Delete customer')
  async deleteCustomer(customerEmail: string) {
    await this.customersListPage.clickAction(customerEmail, 'delete');
    await this.customersListPage.deleteModal.waitForOpened();
    await this.customersListPage.deleteModal.clickConfirm();
    await this.customersListPage.deleteModal.waitForClosed();
  }

  @logStep('Search customer')
  async search(text: string) {
    await this.customersListPage.fillSearchInput(text);
    await this.customersListPage.clickSearch();
    await this.customersListPage.waitForOpened();
  }

  @logStep('Open customers page')
  async open() {
    await this.customersListPage.open('customers');
    await this.customersListPage.waitForOpened();
  }

  assertDetailsData(actual: ICustomerDetails, expected: ICustomerDetails) {
    expect(actual).toEqual({
      ..._.omit(expected, ['_id']),
      createdOn: convertToDateAndTime(expected.createdOn),
    });
  }

  @logStep('Assert Customer Row Visible In Table')
  async assertCustomerRowVisibleInTable(customerEmail: string, { visible }: { visible: boolean }) {
    await expect(this.customersListPage.tableRowByName(customerEmail)).toBeVisible({ visible });
  }
}
