import { expect, Page } from "@playwright/test";
import { OrderDetailsPage } from "ui/pages/orders/orderDetails.page";
import { EditCustomerModal } from "ui/pages/orders/editCustomers.modal";
import { EditProductModal } from "ui/pages/orders/editProducts.modal";
import { logStep } from "utils/report/logStep.utils";
import { NOTIFICATIONS } from "data/salesPortal/notifications";

export class OrderDetailsUIService {
  constructor(
    private orderDetailsPage: OrderDetailsPage,
    private editCustomerModal: EditCustomerModal,
    private editProductsModal: EditProductModal
  ) {}

  @logStep("Select other customer and return name")
  async selectOtherCustomer(): Promise<string> {
    return await this.editCustomerModal.selectOtherCustomer();
  }

  @logStep("Change customer to a different one and verify update")
  async changeCustomerAndVerify() {
    await this.orderDetailsPage.clickEditCustomer();
    await this.editCustomerModal.waitForOpened();

    const newCustomerName = await this.selectOtherCustomer();

    await this.editCustomerModal.clickEdit();
    await this.editCustomerModal.waitForClosed();

    await expect(this.orderDetailsPage.toastMessage).toBeVisible();
    const actualNameOnPage = await this.orderDetailsPage.customerNameValue.innerText();

    expect(actualNameOnPage).toBe(newCustomerName);
  }

  private extractName(fullText: string): string {
    if (!fullText) return "";
    const namePart = fullText.split("(")[0]?.trim();
    return namePart || fullText.trim();
  }

  @logStep("Delete a random product and verify the update")
  async deleteRandomProductAndVerify() {
    await this.orderDetailsPage.clickEditProduct();
    await this.editProductsModal.waitForOpened();
    
    let currentCount = await this.editProductsModal.getProductDropdownsCount();
    if (currentCount <= 1) {
      await this.editProductsModal.clickAddProduct();
      await this.editProductsModal.selectOtherProduct(1); 
      currentCount = await this.editProductsModal.getProductDropdownsCount();
    }
    
    const randomIndex = Math.floor(Math.random() * currentCount);
        
    const nameToDelete = await this.editProductsModal.getProductName(randomIndex);

    await this.editProductsModal.deleteProduct(randomIndex);
        
    await expect(this.editProductsModal.saveButton).toBeEnabled();
    await this.editProductsModal.clickSave();
    await this.editProductsModal.waitForClosed();
       
    await expect(this.orderDetailsPage.toastMessage).toBeVisible();
    await expect(this.orderDetailsPage.toastMessage).toHaveText(NOTIFICATIONS.ORDER_UPDATED);
    
    const namesAfter = await this.orderDetailsPage.getProductNames();
        
    expect(namesAfter).not.toContain(nameToDelete);
  }
}

