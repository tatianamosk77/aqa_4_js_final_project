import { expect } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { STATUS_CODES } from "data/statusCodes";
import { BaseUIService } from "./base.ui-service";
import { logStep } from "utils/report/logStep.utils";
import { AddNewOrderModal } from "ui/pages/orders/addNewOrder.modal";
import { OrdersListPage } from "ui/pages/orders";
import { IOrderFormUIData, IOrderFromResponse } from "data/types/order.types";
import { generateOrderFormData } from "data/salesPortal/orders/generateOrderFormData";

interface ICreateOrderResponseBody {
  Order: IOrderFromResponse;
  IsSuccess: boolean;
  ErrorMessage: string | null;
}

export class AddNewOrderUIService extends BaseUIService {
  private readonly addNewOrderModal: AddNewOrderModal = new AddNewOrderModal(this.page);
  private readonly ordersListPage: OrdersListPage = new OrdersListPage(this.page);

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
  async createWithRandomData() {
    const randomData = generateOrderFormData();
    return await this.create(randomData);
  }

  @logStep("Create minimal order via UI")
  async createMinimalOrder() {
    return await this.create({
      customer: 0,
      products: [0],
    });
  }

  @logStep("Create order with specific customer and products")
  async createSpecificOrder(customerIndex: number, productIndices: number[]) {
    return await this.create({
      customer: customerIndex,
      products: productIndices,
    });
  }
}
