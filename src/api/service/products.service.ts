import { ProductsApi } from "api/api/products.api";
import { generateProductData } from "data/salesPortal/products/generateProductData";
import { createProductSchema } from "data/schemas/products/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { IProduct, IProductFromResponse } from "data/types/product.types";
import { logStep } from "utils/report/logStep.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { oneProductResponseSchema, allProductsResponseSchema, baseOnlyResponseSchema } from "data/schemas/products/product.schema";


export class ProductsApiService {
  constructor(private productsApi: ProductsApi) {}

  @logStep("Create product via API")
  async create(token: string, productData?: IProduct) {
    const data = generateProductData(productData);
    const response = await this.productsApi.create(data, token);

    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
      schema: oneProductResponseSchema,
    });

    return response.body!.Product;
  }

  @logStep("Delete product via API")
  async delete(token: string, id: string) {
    const response = await this.productsApi.delete(id, token);

  validateResponse(response, {
    status: STATUS_CODES.DELETED,
    IsSuccess: true,
    ErrorMessage: null,
    schema: baseOnlyResponseSchema,
  });
  }

  @logStep("Get product by ID via API")
  async getById(token: string, productId: string) {
    const response = await this.productsApi.getById(productId, token);

  validateResponse(response, {
    status: STATUS_CODES.OK,
    IsSuccess: true,
    ErrorMessage: null,
    schema: oneProductResponseSchema,
  });

    return response.body!.Product;
  }

  @logStep("Update product via API")
  async update(id: string, updates: IProduct, token: string) {
    const response = await this.productsApi.update(id, updates, token);

    validateResponse(response, {
    status: STATUS_CODES.OK,
    IsSuccess: true,
    ErrorMessage: null,
    schema: oneProductResponseSchema,
  });

    return response.body!.Product;
  }

  @logStep("Get all products via API")
  async getAll(token: string) {
    const response = await this.productsApi.getAll(token);

    validateResponse(response, {
    status: STATUS_CODES.OK,
    IsSuccess: true,
    ErrorMessage: null,
    schema: allProductsResponseSchema,
  });

    return response.body!;
  }

  @logStep("Populate products via API")
  async populate(count: number = 3, token: string): Promise<IProductFromResponse[]> {
    return await Promise.all(Array.from({ length: count }, async () => await this.create(token)));
  }
}
