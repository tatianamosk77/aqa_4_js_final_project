import type { Page } from "@playwright/test";
import { STATUS_CODES } from "data/statusCodes";
import type { ICustomerResponse } from "data/types/customer.types";
import type { IOrderFilteredResponse, IOrderFromResponse } from "data/types/order.types";
import type { IProductResponse } from "data/types/product.types";

export class ApiMock {
  constructor(private page: Page) {}

  async customers(body: ICustomerResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(/\/api\/customers(\?.*)?$/, async route => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async products(body: IProductResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(/\/api\/products(\?.*)?$/, async route => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async orders(body: IOrderFilteredResponse, statusCode: STATUS_CODES = STATUS_CODES.OK) {
    await this.page.route(/\/api\/orders(\?.*)?$/, async route => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async orderDetails(
    orderId: string,
    body: IOrderFromResponse,
    statusCode: STATUS_CODES = STATUS_CODES.OK
  ) {
    this.page.route(new RegExp(`/api/orders/${orderId}(\\?.*)?$`), async route => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });
    });
  }

  async orderById(orderId: string, body: IOrderFromResponse, statusCode = STATUS_CODES.OK) {
    await this.page.route(new RegExp(`/api/orders/${orderId}(/)?(\\?.*)?$`, "i"), async route => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify({ IsSuccess: true, ErrorMessage: null, Order: body }),
      });
    });
  }

  async unassignManager(
    orderId: string,
    body: unknown,
    statusCode: STATUS_CODES = STATUS_CODES.OK,
    afterFulfill?: () => Promise<void>
  ) {
    const urlRegex = new RegExp(`/api/orders/${orderId}/unassign-manager(\\?.*)?$`);

    await this.page.route(urlRegex, async route => {
      await route.fulfill({
        status: statusCode,
        contentType: "application/json",
        body: JSON.stringify(body),
      });

      if (afterFulfill) await afterFulfill();
    });
  }
}
