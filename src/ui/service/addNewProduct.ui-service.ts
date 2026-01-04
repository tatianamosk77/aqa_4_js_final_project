import { expect } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { generateProductData } from "data/salesPortal/products/generateProductData";
import { STATUS_CODES } from "data/statusCodes";
import { IProduct, IProductResponse } from "data/types/product.types";
import _ from "lodash";
import { AddNewProductPage, ProductsListPage } from "ui/pages/products/index";
import { BaseUIService } from "./base.ui-service";
import { logStep } from "utils/report/logStep.utils";

export class AddNewProductUIService extends BaseUIService {
  private readonly addNewProductPage: AddNewProductPage = new AddNewProductPage(this.page);
  private readonly productsListPage: ProductsListPage = new ProductsListPage(this.page);

  @logStep("Open Add products page")
  async open() {
    await this.productsListPage.open("products");
    await this.productsListPage.clickAddNewProduct();
    await this.addNewProductPage.waitForOpened();
  }

  @logStep("Create a product via UI")
  async create(productData?: Partial<IProduct>) {
    const data = generateProductData(productData);
    await this.addNewProductPage.fillForm(data);
    const response = await this.addNewProductPage.interceptResponse<IProductResponse, any>(
      apiConfig.endpoints.products,
      this.addNewProductPage.clickSave.bind(this.addNewProductPage)
    );
    expect(response.status).toBe(STATUS_CODES.CREATED);
    expect(_.omit(response.body.Product, "_id", "createdOn")).toEqual(data);

    await this.productsListPage.waitForOpened();
    return response.body.Product;
  }

  @logStep("Create a product via UI [Stable]")
  async createStable(productData?: Partial<IProduct>) {
    const data = generateProductData(productData);
    await this.addNewProductPage.fillForm(data);
    
    const responsePromise = this.page.waitForResponse(
      (res) =>
        res.url().includes(apiConfig.endpoints.products) && 
        res.request().method() === "POST",
      { timeout: 10000 }
    );

    await this.addNewProductPage.clickSave();
    const response = await responsePromise;
    
    expect(response.status()).toBe(STATUS_CODES.CREATED);
    
    const body = await response.json();
    await this.productsListPage.waitForOpened();
        
    return body.Product as IProductResponse['Product'];
  }

}
