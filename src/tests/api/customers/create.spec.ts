import { test, expect } from 'fixtures/api.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import _ from 'lodash';
import { TAGS } from 'data/tags';
import { createCustomerSchema } from 'data/schemas/customers/create.schema';
import { generateCustomerData } from 'data/salesPortal/customers/generateCustomerData';
import { validateResponse } from 'utils/validation/validateResponse.utils';
import { ICustomer } from 'data/types/customer.types';
import {
  createCustomerNegativeCases,
  createCustomerPositiveCases,
} from 'data/salesPortal/customers/generateCustomerTestData';

test.describe('[API] [Sales Portal] [Customers]', () => {
  let id = '';
  let token = '';

  test.afterEach(async ({ customersApiService }) => {
    if (id) await customersApiService.delete(token, id);
    id = '';
  });

  test(
    'Create Customer',
    {
      tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
    },
    async ({ loginApiService, customersApi }) => {
      token = await loginApiService.loginAsAdmin();
      const customerData = generateCustomerData();
      const createdCustomer = await customersApi.create(customerData, token);
      validateResponse(createdCustomer, {
        status: STATUS_CODES.CREATED,
        schema: createCustomerSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      id = createdCustomer.body.Customer._id;

      const actualProductData = createdCustomer.body.Customer;
      expect(_.omit(actualProductData, ['_id', 'createdOn'])).toEqual(customerData);
    }
  );

  test(
    'NOT create customer with invalid data',
    {
      tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
    },
    async ({ loginApiService, customersApi }) => {
      token = await loginApiService.loginAsAdmin();
      const customerData = generateCustomerData();
      const createdCustomer = await customersApi.create(
        { ...customerData, name: 123 } as unknown as ICustomer,
        token
      );
      validateResponse(createdCustomer, {
        status: STATUS_CODES.BAD_REQUEST,
        IsSuccess: false,
        ErrorMessage: 'Incorrect request body',
      });
    }
  );

  test.describe(
    'Creating customers with valid data',
    {
      tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
    },
    () => {
      for (const positiveCase of createCustomerPositiveCases) {
        test(`${positiveCase.title}`, async ({ loginApiService, customersApi }) => {
          token = await loginApiService.loginAsAdmin();
          const createdCustomer = await customersApi.create(
            positiveCase.customerData as ICustomer,
            token
          );
          validateResponse(createdCustomer, {
            status: positiveCase.expectedStatus || STATUS_CODES.CREATED,
            schema: createCustomerSchema,
            IsSuccess: true,
            ErrorMessage: null,
          });

          id = createdCustomer.body.Customer._id;

          const actualCustomerData = createdCustomer.body.Customer;
          expect(_.omit(actualCustomerData, ['_id', 'createdOn'])).toEqual(
            positiveCase.customerData
          );
        });
      }
    }
  );

  test.describe(
    'Creating customers with invalid data',
    {
      tag: [TAGS.REGRESSION, TAGS.CUSTOMERS, TAGS.API],
    },
    () => {
      for (const negativeCase of createCustomerNegativeCases) {
        test(`${negativeCase.title}`, async ({ loginApiService, customersApi }) => {
          token = await loginApiService.loginAsAdmin();
          const createdCustomer = await customersApi.create(
            negativeCase.customerData as ICustomer,
            token
          );
          validateResponse(createdCustomer, {
            status: negativeCase.expectedStatus || STATUS_CODES.BAD_REQUEST,
            IsSuccess: false,
            ErrorMessage: 'Incorrect request body',
          });
        });
      }
    }
  );
});
