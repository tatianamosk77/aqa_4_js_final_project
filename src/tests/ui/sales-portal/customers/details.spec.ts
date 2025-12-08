import { test, expect } from 'fixtures/business.fixture';
import _ from 'lodash';
import { TAGS } from 'data/tags';
import { convertToDateAndTime } from 'utils/date.utils';

test.describe('[Sales Portal] [Products] [Customer Details]', () => {
  let id = '';
  let token = '';
  test(
    'Customer Details',
    {
      tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.UI],
    },
    async ({ customersListPage, customerDetailsPage, customersApiService }) => {
      token = await customersListPage.getAuthToken();
      const customer = await customersApiService.create(token);
      await customersListPage.open('customers');
      await customersListPage.waitForOpened();
      await customersListPage.detailsButton(customer.name).click();
      await customerDetailsPage.waitForOpened();
      const actual = await customerDetailsPage.getData();
      const expectedCustomer = {
        ..._.omit(customer, ['_id']),
        createdOn: convertToDateAndTime(customer.createdOn),
      };
      expect(actual).toEqual(expectedCustomer);
    }
  );

  test(
    'Customer Details with services',
    {
      tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.UI],
    },
    async ({
      customersListUIService,
      customersApiService,
      customersListPage,
      customerDetailsPage,
    }) => {
      token = await customersListPage.getAuthToken();

      const customer = await customersApiService.create(token);
      id = customer._id;
      await customersListPage.open('customers');
      await customersListUIService.openDetailsCustomersPage(customer.email);
      const actual = await customerDetailsPage.getData();
      const expectedCustomer = {
        ..._.omit(customer, ['_id']),
        createdOn: convertToDateAndTime(customer.createdOn),
      };
      expect(actual).toEqual(expectedCustomer);
      customersListUIService.assertDetailsData(actual, expectedCustomer);
    }
  );

  test.afterEach(async ({ customersApiService }) => {
    if (id) await customersApiService.delete(token, id);
    id = '';
  });
});
