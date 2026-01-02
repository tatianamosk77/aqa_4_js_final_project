import { SalesPortalPage } from "../sales-portal.page";
import { logStep } from "utils/report/logStep.utils";
import { DELIVERY_TYPE, IDeliveryFormData } from "data/types/delivery.types";

export class ScheduleDeliveryPage extends SalesPortalPage {
  readonly title = this.page.locator("#title");
  readonly deliveryType = this.page.locator("#inputType");
  readonly datePicker = this.page.locator("#datepicker");
  readonly dateInput = this.datePicker.locator("#date-input");
  readonly dateButton = this.datePicker.locator(".d-p-icon");
  readonly datePickerDays = this.page.locator(".datepicker-days");

  readonly locationInput = this.page.locator("#inputLocation");
  readonly countryInput = this.page.locator("#inputCountry");
  readonly inputCity = this.page.locator("#inputCity");
  readonly inputStreet = this.page.locator("#inputStreet");
  readonly inputHouse = this.page.locator("#inputHouse");
  readonly inputFlat = this.page.locator("#inputFlat");

  readonly saveDeliveryButton = this.page.locator("#save-delivery");
  readonly cancelDeliveryButton = this.page.locator("#back-to-order-details-page");

  readonly uniqueElement = this.title;

  @logStep("Fill in schedule delivery form for order")
  async fillDeliveryForm(deliveryData: Partial<IDeliveryFormData>) {
      await this.clickNearestDay();
      
    if (deliveryData.deliveryType === DELIVERY_TYPE.DELIVERY) {
      if (deliveryData.location) {
        await this.locationInput.selectOption(deliveryData.location);
      }
    } else if (deliveryData.deliveryType === DELIVERY_TYPE.PICKUP) {
      if (deliveryData.country) {
        await this.countryInput.selectOption(deliveryData.country);
      }
    }
  }

   @logStep("Click the nearest available day in datepicker")
  async clickNearestDay() {
    await this.dateButton.click();
    await this.datePickerDays.waitFor({ state: "visible" });

    const nearestDay = this.datePickerDays.locator(".day:not(.disabled)").first();
    await nearestDay.waitFor({ state: "visible" });
    await nearestDay.click();
  }

  @logStep("Click save delivery for order")
  async clickSaveDelivery() {
    await this.saveDeliveryButton.waitFor({ state: "visible" });
    await this.saveDeliveryButton.click();
  }

  @logStep("Click cancel delivery for order")
  async clickCancelDelivery() {
    await this.cancelDeliveryButton.click();
  }

  get countryLocator() {
  return this.page.locator("#inputCountry, #selectCountry");
}
}
