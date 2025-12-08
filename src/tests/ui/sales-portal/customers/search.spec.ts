import { TAGS } from 'data/tags';
import { ICustomer } from 'data/types/customer.types';
import { expect, test } from 'fixtures/business.fixture';

test.describe('[Sales Portal] [Customers]', () => {
  let id = '';
  let token = '';

  const fields = ['name', 'email', 'country'] as (keyof ICustomer)[];
  for (const field of fields) {
    test(
      `Search by ${field} field`,
      {
        tag: [TAGS.SMOKE, TAGS.CUSTOMERS, TAGS.UI],
      },
      async ({ customersApiService, customersListUIService, customersListPage }) => {
        token = await customersListPage.getAuthToken();
        const customer = await customersApiService.create(token);
        id = customer._id;
        await customersListUIService.open();
        await customersListUIService.search(String(customer[field]));
        await customersListUIService.assertCustomerRowVisibleInTable(customer.email, {
          visible: true,
        });
      }
    );
  }

  test.afterEach(async ({ customersApiService }) => {
    if (id) await customersApiService.delete(token, id);
    id = '';
  });
  test.skip('Search by name', async ({
    loginUIService,
    customersApiService,
    customersListUIService,
    customersListPage,
  }) => {
    token = await loginUIService.loginAsAdmin();
    const customer = await customersApiService.create(token);
    await customersListUIService.open();
    await customersListUIService.search(customer.name);
    await expect(customersListPage.tableRowByName(customer.name)).toBeVisible();
  });

  test.skip('Search by email', async ({
    loginUIService,
    customersApiService,
    customersListUIService,
    customersListPage,
  }) => {
    token = await loginUIService.loginAsAdmin();
    const customer = await customersApiService.create(token);
    await customersListUIService.open();
    await customersListUIService.search(customer.email);
    await expect(customersListPage.tableRowByName(customer.email)).toBeVisible();
  });

  test.skip('Search by country', async ({
    loginUIService,
    customersApiService,
    customersListUIService,
    customersListPage,
  }) => {
    token = await loginUIService.loginAsAdmin();
    const customer = await customersApiService.create(token);
    await customersListUIService.open();
    await customersListUIService.search(customer.country);
    await expect(customersListPage.tableRowByName(customer.country)).toBeVisible();
  });
});
