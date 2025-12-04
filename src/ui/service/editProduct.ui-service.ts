import { expect, Page } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { generateProductData } from "data/salesPortal/products/generateProductData";
import { STATUS_CODES } from "data/statusCodes";
import { IProductResponse } from "data/types/product.types";
import _ from "lodash";
import { EditProductPage, ProductsListPage } from "ui/pages/products/index";
import { logStep } from "utils/report/logStep.utils";

export class EditProductUIService {
  productsListPage: ProductsListPage;
  editProductPage: EditProductPage;

  constructor(private page: Page) {
    this.editProductPage = new EditProductPage(page);
    this.productsListPage = new ProductsListPage(page);
  }

  @logStep("Open product id for editing")
  async open(id: string) {
    await this.editProductPage.open(`products/${id}/edit`);
    await this.editProductPage.waitForOpened();
  }

  @logStep("Edit product")
  async edit(id: string) {
    const data = generateProductData();
    await this.editProductPage.fillForm(data);
    const response = await this.editProductPage.interceptResponse<IProductResponse, any>(
      apiConfig.endpoints.productById(id),
      this.editProductPage.clickSave.bind(this.editProductPage)
    );
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(_.omit(response.body.Product, "_id", "createdOn")).toEqual(data);

    await this.productsListPage.waitForOpened();
    return response.body.Product;
  }
}
