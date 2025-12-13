import { test, expect } from "fixtures/api.fixture";
import { generateProductData } from "data/salesPortal/products/generateProductData";
import { createProductSchema } from "data/schemas/products/create.schema";
import { errorSchema } from "data/schemas/core.schema";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { IProduct } from "data/types/product.types";

test.describe("[API] [Sales Portal] [Products]", () => {
  test.describe("Update product by ID", () => {
    let token = "";
    let productId = "";
    let originalProductData: IProduct;

    test.beforeEach(async ({ loginApiService, productsApiService }) => {
      token = await loginApiService.loginAsAdmin();
      originalProductData = generateProductData() as IProduct;
      const createdProduct = await productsApiService.create(token, originalProductData);
      productId = createdProduct._id;
    });

    test.afterEach(async ({ productsApiService }) => {
      if (productId) {
        try {
          await productsApiService.delete(token, productId);
        } catch {
          // ignore cleanup errors
        }
      }
    });

    test.describe("Positive", () => {
      test(
        "Should update product successfully",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.SMOKE, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const updateProductData = generateProductData();
          const response = await productsApi.update(productId, updateProductData, token);

          validateResponse(response, {
            status: STATUS_CODES.OK,
            schema: createProductSchema,
            IsSuccess: true,
            ErrorMessage: null,
          });

          const updatedProduct = response.body!.Product;
          expect(updatedProduct._id).toBe(productId);
        }
      );
    });

    test.describe("Negative", () => {
      test(
        "Should NOT update product with empty token",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const emptyToken = "";
          const response = await productsApi.update(productId, generateProductData(), emptyToken);

          validateResponse(response, {
            status: STATUS_CODES.UNAUTHORIZED,
            IsSuccess: false,
            ErrorMessage: "Not authorized",
            schema: errorSchema,
          });
        }
      );

      test(
        "Should NOT update product with invalid token",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi }) => {
          const invalidToken = "Invalid Token";
          const response = await productsApi.update(productId, generateProductData(), invalidToken);

          validateResponse(response, {
            status: STATUS_CODES.UNAUTHORIZED,
            IsSuccess: false,
            ErrorMessage: "Invalid access token",
            schema: errorSchema,
          });
        }
      );

      test(
        "Should NOT update product with duplicate name",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi, productsApiService }) => {
          const firstProduct = await productsApiService.create(token, generateProductData());

          const duplicateProductData = {
            ...originalProductData,
            name: firstProduct.name,
          };

          const duplicateResponse = await productsApi.update(
            productId,
            duplicateProductData,
            token
          );

          validateResponse(duplicateResponse, {
            status: STATUS_CODES.CONFLICT,
            IsSuccess: false,
            ErrorMessage: `Product with name '${firstProduct.name}' already exists`,
            schema: errorSchema,
          });

          await productsApiService.delete(token, firstProduct._id);
        }
      );

      test(
        "Should NOT update non-existent product",
        { tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION] },
        async ({ productsApi, productsApiService }) => {
          const testProduct = await productsApiService.create(token, generateProductData());
          const testProductId = testProduct._id;

          await productsApiService.delete(token, testProductId);

          const response = await productsApi.update(testProductId, generateProductData(), token);

          validateResponse(response, {
            status: STATUS_CODES.NOT_FOUND,
            IsSuccess: false,
            ErrorMessage: `Product with id '${testProductId}' wasn't found`,
            schema: errorSchema,
          });
        }
      );
    });
  });
});
