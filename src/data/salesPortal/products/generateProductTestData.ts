import { generateProductData } from "data/salesPortal/products/generateProductData";
import { IProduct } from "data/types/product.types";
import { STATUS_CODES } from "data/statusCodes";
import { NOTIFICATIONS } from "../notifications";
import { faker } from "@faker-js/faker";
import _ from "lodash";

interface ITestData {
  title: string;
  productData: Partial<IProduct>;
  expectedStatus?: number;
  expectedErrorMessage?: string;
}

const createProduct = (overrides: Partial<IProduct>): Partial<IProduct> =>
  generateProductData(overrides);

const createNegativeProduct = (overrides: Partial<IProduct>): Partial<IProduct> =>
  generateProductData(overrides);

const omitField = (field: keyof IProduct): Partial<IProduct> =>
  _.omit(generateProductData(), field);

export const createProductPositiveCases: ITestData[] = [
  {
    title: "Should create product when name length is 3 characters",
    productData: createProduct({ name: faker.string.alphanumeric(3) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "Should create product when name length is 40 characters",
    productData: createProduct({ name: faker.string.alphanumeric(40) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "Should create product when name contains a single space",
    productData: createProduct({
      name: `${faker.string.alphanumeric(8)} ${faker.string.alphanumeric(8)}`,
    }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "Should create product with price equal to 1",
    productData: createProduct({ price: 1 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "Should create product with price equal to 99999",
    productData: createProduct({ price: 99999 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "Should create product with amount equal to 0",
    productData: createProduct({ amount: 0 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "Should create product with amount equal to 999",
    productData: createProduct({ amount: 999 }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "Should create product when notes length is 250 characters",
    productData: createProduct({ notes: faker.string.alphanumeric(250) }),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "Should create product without notes field",
    productData: omitField("notes"),
    expectedStatus: STATUS_CODES.CREATED,
  },
  {
    title: "Should create product when notes are empty",
    productData: createProduct({ notes: "" }),
    expectedStatus: STATUS_CODES.CREATED,
  },
];

export const createProductNegativeCases: ITestData[] = [
  {
    title: "Should NOT create product when name length is 2 characters",
    productData: createNegativeProduct({ name: faker.string.alphanumeric(2) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when name length is 41 characters",
    productData: createNegativeProduct({ name: faker.string.alphanumeric(41) }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when name contains two spaces",
    productData: createNegativeProduct({ name: "Test  Product" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when name contains special characters",
    productData: createNegativeProduct({
      name: faker.string.alphanumeric(10) + "@#$%",
    }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product without name field",
    productData: omitField("name"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when name is empty",
    productData: createNegativeProduct({ name: "" }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when price is 0",
    productData: createNegativeProduct({ price: 0 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product without manufacturer field",
    productData: omitField("manufacturer"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when price is 100000",
    productData: createNegativeProduct({ price: 100000 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product without price field",
    productData: omitField("price"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when price is negative",
    productData: createNegativeProduct({ price: -50 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when price is not an integer number",
    productData: createNegativeProduct({
      price: faker.string.alphanumeric(5) as any,
    }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when amount is negative",
    productData: createNegativeProduct({ amount: -10 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when amount is 1000",
    productData: createNegativeProduct({ amount: 1000 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product without amount field",
    productData: omitField("amount"),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when amount is not an integer number",
    productData: createNegativeProduct({
      amount: faker.string.alphanumeric(3) as any,
    }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when notes length is 251 characters",
    productData: createNegativeProduct({
      notes: faker.string.alphanumeric(251),
    }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
  {
    title: "Should NOT create product when notes contain '<' or '>' symbols",
    productData: createNegativeProduct({
      notes: "Invalid notes with <symbol>",
    }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST,
  },
];
