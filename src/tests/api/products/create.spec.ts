import { test, expect } from "fixtures/api.fixture";
import { generateProductData } from "data/salesPortal/products/generateProductData";
import { createProductSchema } from "data/schemas/products/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IProduct } from "data/types/product.types";
import { createProductNegativeCases, createProductPositiveCases } from "data/salesPortal/products/generateProductTestData";
import { TAGS } from "data/tags";

test.describe("[API] [Sales Portal] [Products]", () => {
  let id = "";
  let token = "";

  test.afterEach(async ({ productsApiService }) => {
    if (id) await productsApiService.delete(token, id);
  });

  test("Create Product", {
    tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.API],
  },
    async ({ loginApiService, productsApi }) => {
      token = await loginApiService.loginAsAdmin();
      const productData = generateProductData();
      const createdProduct = await productsApi.create(productData, token);
      validateResponse(createdProduct, {
        status: STATUS_CODES.CREATED,
        schema: createProductSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });

      id = createdProduct.body.Product._id;

      const actualProductData = createdProduct.body.Product;
      expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(productData);
    });

  test("NOT create product with invalid data", {
    tag: [TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.API],
  }, async ({ loginApiService, productsApi }) => {
    token = await loginApiService.loginAsAdmin();
    const productData = generateProductData();
    const createdProduct = await productsApi.create({ ...productData, name: 123 } as unknown as IProduct, token);
    validateResponse(createdProduct, {
      status: STATUS_CODES.BAD_REQUEST,
      IsSuccess: false,
      ErrorMessage: "Incorrect request body",
    });
  });

  test.describe("Creating products with valid data", {
    tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.API],
  }, () => {
    for (const positiveCase of createProductPositiveCases) {
      test(`${positiveCase.title}`, async ({ loginApiService, productsApi }) => {
        token = await loginApiService.loginAsAdmin();
        const createdProduct = await productsApi.create(positiveCase.productData as IProduct, token);
        validateResponse(createdProduct, {
          status: positiveCase.expectedStatus || STATUS_CODES.CREATED,
          schema: createProductSchema,
          IsSuccess: true,
          ErrorMessage: null,
        });

        id = createdProduct.body.Product._id;

        const actualProductData = createdProduct.body.Product;
        expect(_.omit(actualProductData, ["_id", "createdOn"])).toEqual(positiveCase.productData);
      });
    }
  });

  test.describe("Creating products with invalid data", {
    tag: [TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.API],
  }, () => {
    for (const negativeCase of createProductNegativeCases) {
      test(`${negativeCase.title}`, async ({ loginApiService, productsApi }) => {
        token = await loginApiService.loginAsAdmin();
        const createdProduct = await productsApi.create(negativeCase.productData as IProduct, token);
        validateResponse(createdProduct, {
          status: negativeCase.expectedStatus || STATUS_CODES.BAD_REQUEST,
          IsSuccess: false,
          ErrorMessage: "Incorrect request body",
        });
      });
    }
  });


});
