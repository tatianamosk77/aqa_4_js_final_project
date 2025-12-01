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

// Вспомогательные функции
const createProduct = (overrides: Partial<IProduct>): Partial<IProduct> =>
    generateProductData(overrides);

const createNegativeProduct = (overrides: Partial<IProduct>): Partial<IProduct> =>
    generateProductData(overrides);

const omitField = (field: keyof IProduct): Partial<IProduct> =>
    _.omit(generateProductData(), field);

export const createProductPositiveCases: ITestData[] = [
    {
        title: "Create product with 3 character length of name",
        productData: createProduct({ name: faker.string.alphanumeric(3) }),
        expectedStatus: STATUS_CODES.CREATED
    },
    {
        title: "Create product with 40 character length of name",
        productData: createProduct({ name: faker.string.alphanumeric(40) }),
        expectedStatus: STATUS_CODES.CREATED
    },
    {
        title: "Create product with 1 space in name",
        productData: createProduct({ name: `Test Product` }),
        expectedStatus: STATUS_CODES.CREATED
    },
    {
        title: "Create product with 1 price",
        productData: createProduct({ price: 1 }),
        expectedStatus: STATUS_CODES.CREATED
    },
    {
        title: "Create product with 99999 price",
        productData: createProduct({ price: 99999 }),
        expectedStatus: STATUS_CODES.CREATED
    },
    {
        title: "Create product with 0 amount",
        productData: createProduct({ amount: 0 }),
        expectedStatus: STATUS_CODES.CREATED
    },
    {
        title: "Create product with 999 amount",
        productData: createProduct({ amount: 999 }),
        expectedStatus: STATUS_CODES.CREATED
    },
    {
        title: "Create product with 250 notes",
        productData: createProduct({ notes: faker.string.alphanumeric(250) }),
        expectedStatus: STATUS_CODES.CREATED
    },
    {
        title: "Create product without notes",
        productData: omitField("notes"),
        expectedStatus: STATUS_CODES.CREATED
    },
    {
        title: "Create product with empty notes",
        productData: createProduct({ notes: "" }),
        expectedStatus: STATUS_CODES.CREATED
    }
];

export const createProductNegativeCases: ITestData[] = [
    {
        title: "2 character name product is not created",
        productData: createNegativeProduct({ name: faker.string.alphanumeric(2) }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "41 character name product is not created",
        productData: createNegativeProduct({ name: faker.string.alphanumeric(41) }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Name with 2 spaces product is not created",
        productData: createNegativeProduct({ name: "Test  Product" }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Name with special characters product is not created",
        productData: createNegativeProduct({ name: faker.string.alphanumeric(10) + "@#$%" }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Product without name is not created",
        productData: omitField("name"),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Empty name product is not created",
        productData: createNegativeProduct({ name: "" }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "0 price product is not created",
        productData: createNegativeProduct({ price: 0 }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Without manufacturer product is not created",
        productData: omitField("manufacturer"),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "100000 price product is not created",
        productData: createNegativeProduct({ price: 100000 }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Product without price is not created",
        productData: omitField("price"),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Negative price product is not created",
        productData: createNegativeProduct({ price: -50 }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Not integer price product is not created",
        productData: createNegativeProduct({ price: faker.string.alphanumeric(5) as any }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Negative amount product is not created",
        productData: createNegativeProduct({ amount: -10 }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "1000 amount product is not created",
        productData: createNegativeProduct({ amount: 1000 }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Product without amount is not created",
        productData: omitField("amount"),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Not integer amount product is not created",
        productData: createNegativeProduct({ amount: faker.string.alphanumeric(3) as any }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "251 notes product is not created",
        productData: createNegativeProduct({ notes: faker.string.alphanumeric(251) }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    },
    {
        title: "Notes with < or > symbols product is not created",
        productData: createNegativeProduct({ notes: "Invalid notes with <symbol>" }),
        expectedStatus: STATUS_CODES.BAD_REQUEST,
        expectedErrorMessage: NOTIFICATIONS.BAD_REQUEST
    }
];