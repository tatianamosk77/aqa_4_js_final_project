import { expect, Page } from "@playwright/test";
import { apiConfig } from "config/apiConfig";
import { generateCustomerDataNew } from "data/salesPortal/customers/generateCustomerData";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomerResponse } from "data/types/customer.types";
import _ from "lodash";
import { EditCustomerPage, CustomersListPage } from "ui/pages/customers/index";
import { logStep } from "utils/report/logStep.utils";

export class EditCustomerUIService {
  customersListPage: CustomersListPage;
  editCustomerPage: EditCustomerPage;

  constructor(private page: Page) {
    this.editCustomerPage = new EditCustomerPage(page);
    this.customersListPage = new CustomersListPage(page);
  }

  @logStep("Open product id for editing")
  async open(id: string) {
    await this.editCustomerPage.open(`customers/${id}/edit`);
    await this.editCustomerPage.waitForOpened();
  }

  @logStep("Edit customer")
  async edit(id: string) {
    const data = generateCustomerDataNew();
    await this.editCustomerPage.fillForm(data);
    const response = await this.editCustomerPage.interceptResponse<ICustomerResponse, any>(
      apiConfig.endpoints.customerById(id),
      this.editCustomerPage.clickSave.bind(this.editCustomerPage)
    );
    expect(response.status).toBe(STATUS_CODES.OK);
    expect(_.omit(response.body.Customer, "_id", "createdOn")).toEqual(data);

    await this.customersListPage.waitForOpened();
    return response.body.Customer;
  }
}
