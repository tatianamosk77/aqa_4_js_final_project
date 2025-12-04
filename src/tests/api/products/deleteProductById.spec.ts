import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { IProductFromResponse } from "data/types/product.types";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { errorSchema } from "data/schemas/core.schema";

test.describe("[API] [Sales Portal] [Products]", () => {
  test.describe("Delete product", () => {
    let token = "";
    let product: IProductFromResponse;

    test.beforeEach(async ({ loginApiService, productsApiService }) => {
      token = await loginApiService.loginAsAdmin();
      product = await productsApiService.create(token);
    });

    test.afterEach(async ({ productsApiService }) => {
      if (product?._id) {
        try {
          await productsApiService.delete(token, product._id);
        } catch {}
      }
    });

    test.describe("Positive", () => {
      test("Should delete product successfully",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const productId = product._id;

          const response = await productsApi.delete(productId, token);
          validateResponse(response, {
            status: STATUS_CODES.DELETED,
          });

          product._id = "";

          const responseAfterDelete = await productsApi.delete(productId, token);
          validateResponse(responseAfterDelete, {
            status: STATUS_CODES.NOT_FOUND,
            IsSuccess: false,
            ErrorMessage: `Product with id '${productId}' wasn't found`,
            schema: errorSchema,
          });
        }
      );
    });

    test.describe("Negative", () => {
      test("Should NOT delete product with empty token",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const emptyToken = "";
          const response = await productsApi.delete(product._id, emptyToken);
          validateResponse(response, {
            status: STATUS_CODES.UNAUTHORIZED,
            IsSuccess: false,
            ErrorMessage: "Not authorized",
            schema: errorSchema,
          });
        }
      );

      test("Should NOT delete product with invalid token",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const invalidToken = "Invalid Token";
          const response = await productsApi.delete(product._id, invalidToken);
          validateResponse(response, {
            status: STATUS_CODES.UNAUTHORIZED,
            IsSuccess: false,
            ErrorMessage: "Invalid access token",
            schema: errorSchema,
          });
        }
      );

      test("Should NOT delete non-existent product",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const productId = "684f45261c508c5d5e553e8a";
          const response = await productsApi.delete(productId, token);
          validateResponse(response, {
            status: STATUS_CODES.NOT_FOUND,
            IsSuccess: false,
            ErrorMessage: `Product with id '${productId}' wasn't found`,
            schema: errorSchema,
          });
        }
      );
    });
  });
});
