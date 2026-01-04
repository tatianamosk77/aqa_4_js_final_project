import { expect, Page } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { STATUS_CODES } from "data/statusCodes";
import { BaseUIService } from "./base.ui-service";
import { logStep } from "utils/report/logStep.utils";
import { AddNewOrderModal } from "ui/pages/orders/addNewOrder.modal";
import { OrdersListPage } from "ui/pages/orders";
import { IOrderFormUIData, IOrderFromResponse } from "data/types/order.types";
import { generateOrderFormData } from "data/salesPortal/orders/generateOrderFormData";
import { CustomersApiService } from "api/service/customers.service";

interface ICreateOrderResponseBody {
  Order: IOrderFromResponse;
  IsSuccess: boolean;
  ErrorMessage: string | null;
}

export class AddNewOrderUIService extends BaseUIService {
  private readonly addNewOrderModal: AddNewOrderModal = new AddNewOrderModal(this.page);
  private readonly ordersListPage: OrdersListPage = new OrdersListPage(this.page);

  constructor(
    page: Page,
    private readonly customersApiService?: CustomersApiService
  ) {
    super(page);
  }
  @logStep("Create an order via UI")
  async create(orderFormData?: IOrderFormUIData) {
    const formData = orderFormData || generateOrderFormData();

    const formResult = await this.addNewOrderModal.fillOrderForm(formData);

    const response = await this.addNewOrderModal.interceptResponse<ICreateOrderResponseBody, []>(
      apiConfig.endpoints.orders,
      async () => {
        await this.addNewOrderModal.clickCreate();
      }
    );

    expect(response.status).toBe(STATUS_CODES.CREATED);

    const order = response.body?.Order;
    expect(order).toBeDefined();

    if (!order) {
      throw new Error("Order is undefined in response");
    }

    await this.ordersListPage.waitForOpened();

    return {
      order,
      formData: formResult,
    };
  }
  @logStep("Create order with random data via UI")
  async createWithRandomData(customerName?: string) {
    const randomData = generateOrderFormData();

    const orderData = customerName ? { ...randomData, customer: customerName } : randomData;

    return await this.create(orderData);
  }

  @logStep("Create minimal order via UI")
  async createMinimalOrder(customerName?: string) {
    const formData: IOrderFormUIData = {
      products: [0],
    };

    if (customerName !== undefined) {
      formData.customer = customerName;
    }

    return await this.create(formData);
  }

  @logStep("Create order with specific customer and products")
  async createSpecificOrder(productIndices: number[], customerName?: string) {
    const formData: IOrderFormUIData = {
      products: productIndices,
    };

    if (customerName !== undefined) {
      formData.customer = customerName;
    }

    return await this.create(formData);
  }

<<<<<<< HEAD
  @logStep("Create an order via UI [Stable]")
  async createStable(customerName: string, products: string[]) {
    await this.addNewOrderModal.fillOrderFormStable({
      customer: customerName,
      products: products
    });

    const response = await this.addNewOrderModal.interceptResponse<ICreateOrderResponseBody, []>(
      apiConfig.endpoints.orders,
      async () => {
        await this.addNewOrderModal.clickCreate();
      }
    );
    
    expect(response.status).toBe(STATUS_CODES.CREATED);

    const order = response.body?.Order;
    if (!order) {
      throw new Error("Order is undefined in response");
    }

    await this.ordersListPage.waitForOpened();

    return { order };
  }

  @logStep("Create minimal order via UI [Stable Precondition]")
  async createMinimalOrderStable(customerName: string, productName: string) {
    await this.addNewOrderModal.selectCustomerByNameStable(customerName);
    await this.addNewOrderModal.selectFirstAvailableProductStable(0);

    // Создаем Promise для ожидания именно POST запроса
    const responsePromise = this.page.waitForResponse(
      (res) =>
        res.url().includes(apiConfig.endpoints.orders) && 
        res.request().method() === "POST",
      { timeout: 10000 }
    );

    await this.addNewOrderModal.clickCreate();
    const response = await responsePromise;

    expect(response.status()).toBe(STATUS_CODES.CREATED);

    const body = await response.json() as ICreateOrderResponseBody;
    const order = body?.Order;

    if (!order) {
      throw new Error("Order creation failed in UI Precondition: No order in response body");
    }

    await this.ordersListPage.waitForOpened();
    return { order };
  }

=======
  @logStep("Create minimal order via UI - SAFE version")
async createMinimalOrderSafe(customerName: string) {
  await this.addNewOrderModal.fillMinimalOrderSafe(customerName);
  
  const response = await this.addNewOrderModal.interceptResponse<ICreateOrderResponseBody, []>(
    apiConfig.endpoints.orders,
    async () => {
      await this.addNewOrderModal.clickCreate();
    }
  );

  expect(response.status).toBe(STATUS_CODES.CREATED);
  const order = response.body?.Order!;
  await this.ordersListPage.waitForOpened();
  
  return { 
    order, 
    formData: { customerName, productNames: ["first"] } 
  };
}
>>>>>>> main
}
