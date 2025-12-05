import { test, expect } from "fixtures/api.fixture";
import { getProductSchema } from "data/schemas/products/get.schema";
import { errorSchema } from "data/schemas/core.schema";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { IProductFromResponse } from "data/types/product.types";

test.describe("[API] [Sales Portal] [Products]", () => {
  test.describe("Get Product By Id", () => {
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
        } catch {
          // Product already deleted, ignore
        }
      }
    });

    test.describe("Positive", () => {
      test("Should get product by id successfully",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const response = await productsApi.getById(product._id, token);
          validateResponse(response, {
            status: STATUS_CODES.OK,
            schema: getProductSchema,
            IsSuccess: true,
            ErrorMessage: null,
          });

          const newProduct = response.body!.Product;
          expect(product).toEqual(newProduct);
        }
      );
    });

    test.describe("Negative", () => {
      test("Should NOT get product by id with empty token",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const emptyToken = "";
          const response = await productsApi.getById(product._id, emptyToken);
          validateResponse(response, {
            status: STATUS_CODES.UNAUTHORIZED,
            IsSuccess: false,
            ErrorMessage: "Not authorized",
            schema: errorSchema,
          });
        }
      );

      test("Should NOT get product by id with invalid token",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const invalidToken = "Invalid Token";
          const response = await productsApi.getById(product._id, invalidToken);
          validateResponse(response, {
            status: STATUS_CODES.UNAUTHORIZED,
            IsSuccess: false,
            ErrorMessage: "Invalid access token",
            schema: errorSchema,
          });
        }
      );

      test("Should NOT get non-existent product by id",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const productId = "684f45261c508c5d5e553e8a";
          const response = await productsApi.getById(productId, token);
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
