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
  readonly theFirstFreeDay = this.datePickerDays.locator("[class='day']:nth-child(1)");

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
    if (deliveryData.deliveryType) {
      await this.deliveryType.selectOption(deliveryData.deliveryType);
    }
    if (deliveryData.deliveryDate) {
      await this.clickActiveDay();
    }

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

  @logStep("Click an active day in datepicker")
  async clickActiveDay() {
    await this.theFirstFreeDay.click();
  }

  @logStep("Click save delivery for order")
  async clickSaveDelivery() {
    await this.saveDeliveryButton.click();
  }

  @logStep("Click cancel delivery for order")
  async clickCancelDelivery() {
    await this.cancelDeliveryButton.click();
  }
}
