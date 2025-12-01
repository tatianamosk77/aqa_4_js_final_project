import { test, expect } from "fixtures/api.fixture";
import { generateProductData } from "data/salesPortal/products/generateProductData";
import { createProductSchema } from "data/schemas/products/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import _ from "lodash";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { ERROR_MESSAGES } from "data/salesPortal/notifications";
import { errorSchema } from "data/schemas/core.schema";
import { MANUFACTURERS } from "data/salesPortal/products/manufacturers";
import { TAGS } from "data/tags";

test.describe("[API] [Sales Portal] [Products]", () => {
  test.describe("Smoke", () => {
    const ids: string[] = [];
    let token = "";

    test.afterEach(async ({ productsApiService }) => {
      if (ids.length) {
        for (const id of ids) {
          await productsApiService.delete(token, id);
        }
        ids.length = 0;
      }
    });

    test("Update product", {
      tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.API],
    },
      async ({ loginApiService, productsApiService, productsApi }) => {
        //TODO: Preconditions
        token = await loginApiService.loginAsAdmin();
        const createdProduct = await productsApiService.create(token);
        ids.push(createdProduct._id);

        //TODO: Action
        const updatedProductData = generateProductData();
        const updatedProductResponse = await productsApi.update(createdProduct._id, updatedProductData, token);

        //TODO: Assert
        validateResponse(updatedProductResponse, {
          status: STATUS_CODES.OK,
          schema: createProductSchema,
          IsSuccess: true,
          ErrorMessage: null,
        });

        const updatedProduct = updatedProductResponse.body.Product;
        expect(_.omit(updatedProduct, ["_id", "createdOn"])).toEqual(updatedProductData);
        expect(createdProduct._id).toBe(updatedProduct._id);
      });
  });

  test.describe("NOT SMOKE", () => {
    const ids: string[] = [];
    let token = "";

    test.beforeEach(async ({ loginApiService }) => {
      token = await loginApiService.loginAsAdmin();
    });
    test.afterEach(async ({ productsApiService }) => {
      if (ids.length) {
        for (const id of ids) {
          await productsApiService.delete(token, id);
        }
        ids.length = 0;
      }
    });

    test("Should NOT update product without token", {
      tag: [TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.API],
    }, async ({ productsApi, productsApiService }) => {
      const product = await productsApiService.create(token);
      ids.push(product._id);

      const response = await productsApi.update(product._id, generateProductData(), "");
      validateResponse(response, {
        IsSuccess: false,
        status: STATUS_CODES.UNAUTHORIZED,
        ErrorMessage: ERROR_MESSAGES.UNAUTHORIZED,
        schema: errorSchema,
      });
    });

    test("Should NOT update product with not existing id", {
      tag: [TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.API],
    }, async ({ productsApi }) => {
      const id = "690a3cfbef33a32d75a96737";
      const response = await productsApi.update(id, generateProductData(), token);
      validateResponse(response, {
        IsSuccess: false,
        status: STATUS_CODES.NOT_FOUND,
        ErrorMessage: ERROR_MESSAGES.PRODUCT_NOT_FOUND(id),
        schema: errorSchema,
      });
    });

    test("Should NOT update product with existing product name", {
      tag: [TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.API],
    }, async ({ productsApi, productsApiService }) => {
      const product1 = await productsApiService.create(token);
      const product2 = await productsApiService.create(token);

      ids.push(product1._id, product2._id);

      const response = await productsApi.update(product1._id, generateProductData({ name: product2.name }), token);
      validateResponse(response, {
        IsSuccess: false,
        status: STATUS_CODES.CONFLICT,
        ErrorMessage: ERROR_MESSAGES.PRODUCT_ALREADY_EXISTS(product2.name),
        schema: errorSchema,
      });
    });

    test("Should update product with max valid data",
      {
        tag: [TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.API],
      }, async ({ productsApi, productsApiService }) => {
        const product = await productsApiService.create(token);
        ids.push(product._id);
        const productData = {
          name: "Gloves64242aaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          amount: 999,
          price: 99999,
          manufacturer: MANUFACTURERS.SONY,
          notes:
            "FugGijgp9M7HnljmfGpmqL2A8WqDnxSv0XdGDImYs8poMqJgkaD7rbqv9HyZzPZtGU6JxKOhvg6OvihDqoCdQ6aGZ3ekUg9aIZJYuKkXoAP4qwKAyK9dNj5LZMUjZw0SekIs3apD77gwMC8HBgJu9u1R2870NuDwp8wPrEWag5aFIEKmTeoP7XLRlLDYI7cEo8feLmvO9b2nvjs2LtE0DYUPhMuMrqHunMhbPdwieMw16CSYWisdw9hlRz",
        };
        const response = await productsApi.update(product._id, generateProductData(productData), token);
        validateResponse(response, {
          IsSuccess: false,
          status: STATUS_CODES.OK,
          ErrorMessage: null,
          schema: createProductSchema,
        });

        expect(_.omit(response.body.Product, ["_id", "createdOn"])).toEqual(productData);
      });

    test("Should update product with min valid data", {
      tag: [TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.API],
    },
      async ({ productsApi, productsApiService }) => {
        const product = await productsApiService.create(token);
        ids.push(product._id);
        const productData = {
          name: "gC1",
          amount: 0,
          price: 1,
          manufacturer: MANUFACTURERS.SONY,
          notes: "",
        };
        const response = await productsApi.update(product._id, generateProductData(productData), token);
        validateResponse(response, {
          IsSuccess: false,
          status: STATUS_CODES.OK,
          ErrorMessage: null,
          schema: createProductSchema,
        });
        expect(_.omit(response.body.Product, ["_id", "createdOn"])).toEqual(productData);
      });
  });
});
