import { faker } from "@faker-js/faker";
import { COUNTRIES } from "./countries";
import { ICustomer, ICustomerFromResponse } from "data/types/customer.types";

// Валидные значения country для API (исключаем UK, так как API принимает только "Great Britain")
const VALID_COUNTRIES = [
  COUNTRIES.USA,
  COUNTRIES.CANADA,
  COUNTRIES.BELARUS,
  COUNTRIES.UKRAINE,
  COUNTRIES.GERMANY,
  COUNTRIES.FRANCE,
  COUNTRIES.GREAT_BRITAIN,
  COUNTRIES.RUSSIA,
] as const;

export function generateCustomerData(params?: Partial<ICustomer>): ICustomer {
  return {
    email: faker.internet.email(),
    name: `${faker.person.firstName()} ${faker.person.firstName()}`,
    country:
      params?.country || VALID_COUNTRIES[Math.floor(Math.random() * VALID_COUNTRIES.length)]!,
    city: "testCity",
    flat: faker.number.int({ min: 1, max: 9999 }),
    house: faker.number.int({ min: 1, max: 999 }),
    notes: faker.string.alphanumeric({ length: 250 }),
    phone: `+${faker.string.numeric(10)}`,
    street: "testStreet",
    ...params,
  };
}

export function generateCustomerDataNew(params?: Partial<ICustomer>): ICustomer {
  return {
    email: faker.internet.email(),
    name: `${faker.person.firstName()} ${faker.person.firstName()}`,
    country:
      params?.country || VALID_COUNTRIES[Math.floor(Math.random() * VALID_COUNTRIES.length)]!,
    city: faker.location.city(),
    flat: faker.number.int({ min: 1, max: 9999 }),
    house: faker.number.int({ min: 1, max: 999 }),
    notes: faker.string.alphanumeric({ length: 250 }),
    phone: `+${faker.string.numeric(10)}`,
    street: faker.location.street(),
    ...params,
  };
}

export function generateCustomerFromResponse(
  params?: Partial<ICustomerFromResponse> & { _id?: string }
): ICustomerFromResponse {
  const base = generateCustomerDataNew(params);

  return {
    _id: params?._id ?? faker.database.mongodbObjectId(),
    createdOn: params?.createdOn ?? faker.date.recent().toISOString(),
    ...base,
    ...params,
    notes: params?.notes ?? base.notes ?? faker.string.alphanumeric({ length: 250 }),
  };
}
