import { Locator } from "@playwright/test";
import { SalesPortalPage } from "../sales-portal.page";

export class CustomerDetailsSection extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#customer-section");

  readonly dataContainer = this.uniqueElement.locator(".p-3");
  readonly editCustomerButton = this.uniqueElement.locator("#edit-customer-pencil");

  async getAllCustomerDetails(): Promise<Record<string, string>> {
    const customerInfo: Record<string, string> = {};

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
          const cleanKey = key.trim().replace(/:\s*$/, "");
          customerInfo[cleanKey] = value;
        }
      } catch (error) {
        console.warn("Ошибка при получении строки:", error);
      }
    }

    return customerInfo;
  }

  async getCustomerField(fieldName: string): Promise<string> {
    try {
      const fieldLabel = this.dataContainer.locator(".strong-details", {
        hasText: new RegExp(`^${fieldName}\\b`, "i"),
      });

      if ((await fieldLabel.count()) > 0) {
        const parent = fieldLabel.locator("..");
        const value = await parent.locator("span:nth-child(2)").innerText();
        return value.trim();
      }

      const partialLabel = this.dataContainer.locator(".strong-details", {
        hasText: fieldName,
      });

      if ((await partialLabel.count()) > 0) {
        const parent = partialLabel.locator("..");
        const value = await parent.locator("span:nth-child(2)").innerText();
        return value.trim();
      }

      return "";
    } catch (error) {
      console.error(`Ошибка при получении поля "${fieldName}":`, error);
      return "";
    }
  }

  async getStructuredCustomerData(): Promise<{
    email: string;
    name: string;
    address: {
      country: string;
      city: string;
      street: string;
      house: string;
      flat: string;
    };
    phone: string;
    createdOn: string;
    notes: string;
  }> {
    const info = await this.getAllCustomerDetails();

    return {
      email: info["Email"] || "",
      name: info["Name"] || "",
      address: {
        country: info["Country"] || "",
        city: info["City"] || "",
        street: info["Street"] || "",
        house: info["House"] || "",
        flat: info["Flat"] || "",
      },
      phone: info["Phone"] || "",
      createdOn: info["Created On"] || info["Created"] || "",
      notes: info["Notes"] || "-",
    };
  }

  getCustomerRow(indexOrLabel: number | string): Locator {
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

  async getCustomerRowData(indexOrLabel: number | string): Promise<{
    label: string;
    value: string;
    rowElement: Locator;
  }> {
    const row = this.getCustomerRow(indexOrLabel);

    const label = await row.locator(".strong-details").innerText();
    const value = await row.locator("span:nth-child(2)").innerText();

    return {
      label: label.trim().replace(/:\s*$/, ""),
      value: value.trim(),
      rowElement: row,
    };
  }
}
