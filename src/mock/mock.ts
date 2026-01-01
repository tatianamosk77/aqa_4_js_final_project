import type { Page } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { STATUS_CODES } from "data/statusCodes";
import { IMetricsResponse } from "data/types/metrics.types";
import { IOrdersSortedResponse } from "data/types/order.types";
import { IProductResponse, IProductsSortedResponse } from "data/types/product.types";
import { ApiMock } from "./apiMock";

export class Mock extends ApiMock {
  constructor(page: Page) {
    super(page);
  }

  async productsPage(body: IProductsSortedResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(/\/api\/products(\?.*)?$/, async route => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async productDetailsModal(body: IProductResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(
      apiConfig.baseURL + apiConfig.endpoints.productById(body.Product._id),
      async route => {
        await route.fulfill({
          status: statusCode,
          contentType: "application/json",
          body: JSON.stringify(body),
        });
      }
    );
  }

  async homePageMetrics(body: IMetricsResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(apiConfig.baseURL + apiConfig.endpoints.metrics, async route => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async ordersPage(body: IOrdersSortedResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(/\/api\/orders(\?.*)?$/, async route => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }
}
