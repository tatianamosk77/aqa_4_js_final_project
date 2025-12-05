import { test, expect } from "fixtures/api.fixture";
import { allProductsResponseSchema } from "data/schemas/products/product.schema";
import { errorSchema } from "data/schemas/core.schema";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { IProductFromResponse } from "data/types/product.types";

test.describe("[API] [Sales Portal] [Products]", () => {
  test.describe("Get All Products", () => {
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
      test("Should get all products successfully",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const response = await productsApi.getAll(token);
          validateResponse(response, {
            status: STATUS_CODES.OK,
            schema: allProductsResponseSchema,
            IsSuccess: true,
            ErrorMessage: null,
          });

          const products = response.body!.Products;
          expect(Array.isArray(products)).toBeTruthy();
          expect(products.length).toBeGreaterThan(0);
        }
      );
    });

    test.describe("Negative", () => {
      test("Should NOT get all products with empty token",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const emptyToken = "";
          const response = await productsApi.getAll(emptyToken);
          validateResponse(response, {
            status: STATUS_CODES.UNAUTHORIZED,
            IsSuccess: false,
            ErrorMessage: "Not authorized",
            schema: errorSchema,
          });
        }
      );

      test("Should NOT get all products with invalid token",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const invalidToken = "Invalid access token";
          const response = await productsApi.getAll(invalidToken);
          validateResponse(response, {
            status: STATUS_CODES.UNAUTHORIZED,
            IsSuccess: false,
            ErrorMessage: "Invalid access token",
            schema: errorSchema,
          });
        }
      );
    });
  });
});
