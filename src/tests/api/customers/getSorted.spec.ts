import { test, expect } from 'fixtures/api.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validation/validateResponse.utils';
import { TAGS } from 'data/tags';

test.describe('[API] [Sales Portal] [Customers] Get Sorted', () => {
  test.describe('Search', () => {
    let id = '';
    let token = '';

    test.beforeEach(async ({ loginApiService }) => {
      token = await loginApiService.loginAsAdmin();
    });
    test.afterEach(async ({ customersApiService }) => {
      if (id) await customersApiService.delete(token, id);
      id = '';
    });

    test('Search by name', async ({ customersApiService, customersApi }) => {
      const customer = await customersApiService.create(token);

      const response = await customersApi.getSorted(token, { search: customer.name });

      validateResponse(response, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
      });
      const { limit, search, country, total, page, sorting } = response.body;
      const found = response.body.Customers.find(el => el._id === customer._id);
      expect.soft(found, 'Created customer should be in response').toBeTruthy();
      expect.soft(limit, `Limit should be ${limit}`).toBe(10);
      expect.soft(search).toBe(customer.name);
      expect.soft(country).toEqual([]);
      expect.soft(page).toBe(1);
      expect.soft(sorting).toEqual({ sortField: 'createdOn', sortOrder: 'desc' });
      expect.soft(total).toBeGreaterThanOrEqual(1);
    });

    test('Search by email', async ({ customersApiService, customersApi }) => {
      const customer = await customersApiService.create(token);

      const response = await customersApi.getSorted(token, { search: customer.email });

      validateResponse(response, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
      });
      const { limit, search, country, total, page, sorting } = response.body;
      const found = response.body.Customers.find(el => el._id === customer._id);
      expect.soft(found, 'Created customer should be in response').toBeTruthy();
      expect.soft(limit, `Limit should be ${limit}`).toBe(10);
      expect.soft(search).toBe(customer.email);
      expect.soft(country).toEqual([]);
      expect.soft(page).toBe(1);
      expect.soft(sorting).toEqual({ sortField: 'createdOn', sortOrder: 'desc' });
      expect.soft(total).toBeGreaterThanOrEqual(1);
    });

    test('Search by country', async ({ customersApiService, customersApi }) => {
      const customer = await customersApiService.create(token);

      const response = await customersApi.getSorted(token, { search: customer.country });

      validateResponse(response, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
      });
      const { limit, search, country, total, page, sorting } = response.body;
      const found = response.body.Customers.find(el => el._id === customer._id);
      expect.soft(found, 'Created customer should be in response').toBeTruthy();
      expect.soft(limit, `Limit should be ${limit}`).toBe(10);
      expect.soft(search).toBe(customer.country);
      expect.soft(country).toEqual([]);
      expect.soft(page).toBe(1);
      expect.soft(sorting).toEqual({ sortField: 'createdOn', sortOrder: 'desc' });
      expect.soft(total).toBeGreaterThanOrEqual(1);
    });
  });

  test.describe('Sorting', () => {
    const ids: string[] = [];
    let token = '';

    test.beforeEach(async ({ loginApiService }) => {
      token = await loginApiService.loginAsAdmin();
    });
    test.afterEach(async ({ customersApiService }) => {
      if (ids.length) {
        for (const id of ids) {
          await customersApiService.delete(token, id);
        }
        ids.length = 0;
      }
    });

    test('SortField: createdOn, sortOrder: asc', async ({
      customersApiService,
      customersApi,
      page,
    }) => {
      const customer1 = await customersApiService.create(token);
      await page.waitForTimeout(5000);
      const customer2 = await customersApiService.create(token);

      ids.push(customer1._id, customer2._id);
      const response = await customersApi.getSorted(token, {
        sortField: 'createdOn',
        sortOrder: 'asc',
      });
      const allCustomers = await customersApi.getAll(token);

      validateResponse(response, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const actualCustomers = response.body.Customers;

      const sorted = allCustomers.body.Customers.toSorted((a, b) => {
        const dateA = new Date(a.createdOn);
        const dateB = new Date(b.createdOn);

        return dateA.getTime() - dateB.getTime();
      }).slice(0, 10);

      actualCustomers.forEach((actual, index) => {
        expect.soft(actual).toEqual(sorted[index]);
      });

      const { limit, search, country, total, page: pageParam, sorting } = response.body;
      expect.soft(limit, `Limit should be ${limit}`).toBe(10);
      expect.soft(search).toBe('');
      expect.soft(country).toEqual([]);
      expect.soft(pageParam).toBe(1);
      expect.soft(sorting).toEqual({ sortField: 'createdOn', sortOrder: 'asc' });
      expect.soft(total).toBeGreaterThanOrEqual(2);
    });

    test.skip('SortField: createdOn, sortOrder: desc', async ({
      customersApiService,
      customersApi,
      page,
    }) => {
      const customer1 = await customersApiService.create(token);
      await page.waitForTimeout(5000);
      const customer2 = await customersApiService.create(token);

      ids.push(customer1._id, customer2._id);
      const response = await customersApi.getSorted(token, {
        sortField: 'createdOn',
        sortOrder: 'desc',
      });
      const allCustomers = await customersApi.getAll(token);

      validateResponse(response, {
        status: STATUS_CODES.OK,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const actualCustomers = response.body.Customers;

      const sorted = allCustomers.body.Customers.toSorted((a, b) => {
        const dateA = new Date(a.createdOn);
        const dateB = new Date(b.createdOn);

        return dateB.getTime() - dateA.getTime();
      }).slice(0, 10);

      actualCustomers.forEach((actual, index) => {
        expect.soft(actual).toEqual(sorted[index]);
      });

      const { limit, search, country, total, page: pageParam, sorting } = response.body;
      expect.soft(limit, `Limit should be ${limit}`).toBe(10);
      expect.soft(search).toBe('');
      expect.soft(country).toEqual([]);
      expect.soft(pageParam).toBe(1);
      expect.soft(sorting).toEqual({ sortField: 'createdOn', sortOrder: 'desc' });
      expect.soft(total).toBeGreaterThanOrEqual(2);
    });

    test(
      'SortField: country, sortOrder: desc',
      {
        tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
      },
      async ({ customersApiService, customersApi, page }) => {
        const customer1 = await customersApiService.create(token);
        await page.waitForTimeout(1000);
        const customer2 = await customersApiService.create(token);

        ids.push(customer1._id, customer2._id);
        const response = await customersApi.getSorted(token, {
          sortField: 'country',
          sortOrder: 'desc',
        });

        validateResponse(response, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
        });

        const actualCustomers = response.body.Customers;

        // Verify sorting order: country should be in descending order
        for (let i = 0; i < actualCustomers.length - 1; i++) {
          const current = actualCustomers[i]!;
          const next = actualCustomers[i + 1]!;

          // For descending order, current should be >= next
          // localeCompare returns: negative if current < next, 0 if equal, positive if current > next
          const countryCompare = current.country.localeCompare(next.country);
          expect
            .soft(
              countryCompare >= 0,
              `Customers should be sorted by country desc. Found: ${current.country} before ${next.country}, but ${current.country} < ${next.country}`
            )
            .toBe(true);

          // If countries are equal, verify secondary sort is consistent
          if (countryCompare === 0) {
            const dateA = new Date(current.createdOn);
            const dateB = new Date(next.createdOn);
            // Secondary sort should be descending by createdOn (newer dates first)
            expect
              .soft(
                dateA.getTime() >= dateB.getTime(),
                `When countries are equal, should be sorted by createdOn desc. Found: ${current.createdOn} before ${next.createdOn}, but ${current.createdOn} < ${next.createdOn}`
              )
              .toBe(true);
          }
        }

        const { limit, search, country, total, page: pageParam, sorting } = response.body;
        expect.soft(limit, `Limit should be ${limit}`).toBe(10);
        expect.soft(search).toBe('');
        expect.soft(country).toEqual([]);
        expect.soft(pageParam).toBe(1);
        expect.soft(sorting).toEqual({ sortField: 'country', sortOrder: 'desc' });
        expect.soft(total).toBeGreaterThanOrEqual(2);
      }
    );
  });
});
