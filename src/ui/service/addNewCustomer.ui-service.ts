import { expect } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomer, ICustomerResponse } from "data/types/customer.types";
import _ from "lodash";
import { AddNewCustomerPage, CustomersListPage } from "ui/pages/customers/index";
import { BaseUIService } from "./base.ui-service";
import { logStep } from "utils/report/logStep.utils";

export class AddNewCustomerUIService extends BaseUIService {
  private readonly addNewCustomerPage: AddNewCustomerPage = new AddNewCustomerPage(this.page);
  private readonly customersListPage: CustomersListPage = new CustomersListPage(this.page);

  @logStep("Open Add customers page")
  async open() {
    await this.customersListPage.open("customers");
    await this.customersListPage.clickAddNewCustomer();
    await this.addNewCustomerPage.waitForOpened();
  }

  @logStep("Create a customer via UI")
  async create(customerData?: Partial<ICustomer>) {
    const data = generateCustomerData(customerData);
    await this.addNewCustomerPage.fillForm(data);
    const response = await this.addNewCustomerPage.interceptResponse<ICustomerResponse, any>(
      apiConfig.endpoints.customers,
      this.addNewCustomerPage.clickSave.bind(this.addNewCustomerPage)
    );
    expect(response.status).toBe(STATUS_CODES.CREATED);
    expect(_.omit(response.body.Customer, "_id", "createdOn")).toEqual(data);

    await this.customersListPage.waitForOpened();
    return response.body.Customer;
  }



  @logStep("Create a customer via UI [Stable]")
  async createStable(customerData?: Partial<ICustomer>) {
    const data = generateCustomerData(customerData);
    await this.addNewCustomerPage.fillForm(data);
    // Ждем именно POST запрос, чтобы не перехватить GET (200) от списка
    const responsePromise = this.page.waitForResponse(
      (res) =>
        res.url().includes(apiConfig.endpoints.customers) && 
        res.request().method() === "POST",
      { timeout: 10000 }
    );

    await this.addNewCustomerPage.clickSave();
    const response = await responsePromise;

    // Ожидаю, что придет 201
    expect(response.status()).toBe(STATUS_CODES.CREATED);
    
    const body = await response.json();
    await this.customersListPage.waitForOpened();
    
    return body.Customer as ICustomerResponse['Customer'];
  }
}
