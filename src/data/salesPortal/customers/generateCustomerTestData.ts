import { STATUS_CODES } from 'data/statusCodes';
import { NOTIFICATIONS } from '../notifications';
import { faker } from '@faker-js/faker';
import _ from 'lodash';
import { ICustomer } from 'data/types/customer.types';
import { generateCustomerData } from './generateCustomerData';

interface ITestCustomerData {
  title: string;
  customerData: Partial<ICustomer>;
  expectedStatus?: number;
  expectedErrorMessage?: string;
}

// Вспомогательные функции
const createCustomer = (overrides: Partial<ICustomer>): Partial<ICustomer> =>
  generateCustomerData(overrides);

const createNegativeCustomer = (overrides: Partial<ICustomer>): Partial<ICustomer> =>
  generateCustomerData(overrides);

const omitField = (field: keyof ICustomer): Partial<ICustomer> =>
  _.omit(generateCustomerData(), field);

export const createCustomerPositiveCases: ITestCustomerData[] = [
  {
    title: 'Create customer with 1 character length of name',
    customerData: createCustomer({ name: faker.string.alpha(1) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with 40 character length of name',
    customerData: createCustomer({
      name: `${faker.string.alpha(19)} ${faker.string.alpha(20)}`,
    }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with 1 space in name',
    customerData: createCustomer({ name: `Test Customer` }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with valid email format',
    customerData: createCustomer({ email: faker.internet.email() }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with 1 character length of city',
    customerData: createCustomer({ city: faker.string.alphanumeric(1) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with 40 character length of city', // requires 40, but includes max 20
    customerData: createCustomer({
      city: `${faker.string.alpha(19)} ${faker.string.alpha(20)}`,
    }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with 1 character length of street',
    customerData: createCustomer({ street: faker.string.alphanumeric(1) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with 40 character length of street',
    customerData: createCustomer({ street: faker.string.alphanumeric(40) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with 1 flat',
    customerData: createCustomer({ flat: 1 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with 9999 flat',
    customerData: createCustomer({ flat: 9999 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with 1 house',
    customerData: createCustomer({ house: 1 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with 999 house',
    customerData: createCustomer({ house: 999 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with 250 notes',
    customerData: createCustomer({ notes: faker.string.alphanumeric(250) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with a valid phone',
    customerData: createCustomer({ phone: `+${faker.string.numeric(10)}` }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer without notes',
    customerData: omitField('notes'),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: 'Create customer with empty notes',
    customerData: createCustomer({ notes: '' }),
    expectedStatus: STATUS_CODES.CREATED,
  },
];

export const createCustomerNegativeCases: ITestCustomerData[] = [
  {
    title: '0 character name customer is not created',
    customerData: createNegativeCustomer({ name: '' }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: '41 character name customer is not created',
    customerData: createNegativeCustomer({ name: faker.string.alphanumeric(41) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Name with 2 spaces in customer is not created',
    customerData: createNegativeCustomer({ name: 'Test  Customer' }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Name with special characters in customer is not created',
    customerData: createNegativeCustomer({ name: faker.string.alphanumeric(10) + '@#$%' }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Customer without name is not created',
    customerData: omitField('name'),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Customer with invalid email is not created',
    customerData: createNegativeCustomer({ email: faker.string.alphanumeric(10) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: '0 flat of customer is not created',
    customerData: createNegativeCustomer({ flat: 0 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: '0 house of customer is not created',
    customerData: createNegativeCustomer({ house: 0 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Without country customer is not created',
    customerData: omitField('country'),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: '10000 flat of customer is not created',
    customerData: createNegativeCustomer({ flat: 10000 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: '1000 house of customer is not created',
    customerData: createNegativeCustomer({ house: 1000 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Customer without email is not created',
    customerData: omitField('email'),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Customer without phone is not created',
    customerData: omitField('phone'),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Customer without house is not created',
    customerData: omitField('house'),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Customer without flat is not created',
    customerData: omitField('flat'),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Customer without city is not created',
    customerData: omitField('city'),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Customer without street is not created',
    customerData: omitField('street'),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Negative price house customer is not created',
    customerData: createNegativeCustomer({ house: -50 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Not integer flat customer is not created',
    customerData: createNegativeCustomer({ flat: faker.string.alphanumeric(5) as any }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Negative amount flat is not created',
    customerData: createNegativeCustomer({ flat: -10 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: '251 notes customer is not created',
    customerData: createNegativeCustomer({ notes: faker.string.alphanumeric(251) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: 'Notes with < or > symbols customer is not created',
    customerData: createNegativeCustomer({ notes: 'Invalid notes with <symbol>' }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
];
