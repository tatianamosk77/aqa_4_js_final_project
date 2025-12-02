import { test, expect } from 'fixtures/api.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { TAGS } from 'data/tags.js';

test.describe('[API] [Sales Portal] [Customers]', () => {
  test(
    'Delete Customer',
    {
      tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
    },
    async ({ loginApiService, customersApiService, customersApi }) => {
      //arrange
      const token = await loginApiService.loginAsAdmin();
      const createdCustomer = await customersApiService.create(token);
      const id = createdCustomer._id;
      //act
      const response = await customersApi.delete(id, token);
      //assert
      expect(response.status).toBe(STATUS_CODES.DELETED);
    }
  );
});
