import { faker } from '@faker-js/faker';
import { getRandomEnumValue } from 'utils/enum.utils';
import { COUNTRIES } from './countries';
import { ICustomer } from 'data/types/customer.types';

export function generateCustomerData(params?: Partial<ICustomer>): ICustomer {
  return {
    email: faker.internet.email(),
    name: faker.person.firstName() + ' ' + faker.person.lastName(),
    country: getRandomEnumValue(COUNTRIES),
    city: faker.location.city(),
    flat: faker.number.int({ min: 1, max: 9999 }),
    house: faker.number.int({ min: 1, max: 999 }),
    notes: faker.string.alphanumeric({ length: 250 }),
    phone: `+${faker.string.numeric(10)}`,
    street: faker.location.street(),
    ...params,
  };
}
