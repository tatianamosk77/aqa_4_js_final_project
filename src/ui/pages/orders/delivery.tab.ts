import { Locator } from "@playwright/test";
import { SalesPortalPage } from "../sales-portal.page";

export class DeliveryTab extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#delivery");

  readonly dataContainer = this.uniqueElement.locator(".mb-4");
  readonly scheduleDeliveryButton = this.uniqueElement.locator("#delivery-btn");

  async getAllDeliveryInfo(): Promise<Record<string, string>> {
    const deliveryInfo: Record<string, string> = {};

    const rows = await this.dataContainer.locator(".strong-details").all();

    for (const row of rows) {
      try {
        const key = await row.innerText();
        const value = await row.evaluate(element => {
          const parent = element.parentElement;
          if (parent) {
            const valueSpan = parent.querySelector("span:nth-child(2)");
            return valueSpan?.textContent?.trim() || "";
          }
          return "";
        });

        if (key && key.trim()) {
          deliveryInfo[key.trim()] = value;
        }
      } catch (error) {
        console.warn("Ошибка при получении строки:", error);
      }
    }

    return deliveryInfo;
  }

  async getDeliveryField(fieldName: string): Promise<string> {
    try {
      const fieldLabel = this.dataContainer.locator(".strong-details", { hasText: fieldName });

      if ((await fieldLabel.count()) > 0) {
        const parent = fieldLabel.locator("..");
        const value = await parent.locator("span:nth-child(2)").innerText();
        return value.trim();
      }

      return "";
    } catch (error) {
      console.error(`Ошибка при получении поля "${fieldName}":`, error);
      return "";
    }
  }

  async getStructuredDeliveryData(): Promise<{
    deliveryType: string;
    deliveryDate: string;
    address: {
      country: string;
      city: string;
      street: string;
      house: string;
      flat: string;
    };
    scheduleDelivery: string;
  }> {
    const info = await this.getAllDeliveryInfo();

    return {
      deliveryType: info["Delivery Type"] || info["Delivery Type:"] || "",
      deliveryDate: info["Delivery Date"] || info["Delivery Date:"] || "",
      address: {
        country: info["Country"] || info["Country:"] || "",
        city: info["City"] || info["City:"] || "",
        street: info["Street"] || info["Street:"] || "",
        house: info["House"] || info["House:"] || "",
        flat: info["Flat"] || info["Flat:"] || "",
      },
      scheduleDelivery: info["Schedule Delivery"] || info["Schedule Delivery:"] || "",
    };
  }

  getDeliveryRow(indexOrLabel: number | string) {
    if (typeof indexOrLabel === "number") {
      return this.dataContainer.locator(".strong-details").nth(indexOrLabel).locator("..");
    } else {
      return this.dataContainer
        .locator(".strong-details", {
          hasText: indexOrLabel,
        })
        .locator("..");
    }
  }

  async getDeliveryRowData(indexOrLabel: number | string): Promise<{
    label: string;
    value: string;
    rowElement: Locator;
  }> {
    const row = this.getDeliveryRow(indexOrLabel);

    const label = await row.locator(".strong-details").innerText();

    const value = await row.locator("span:nth-child(2)").innerText();

    return {
      label: label.trim(),
      value: value.trim(),
      rowElement: row,
    };
  }
}
