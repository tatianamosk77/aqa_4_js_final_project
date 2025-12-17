import { ORDER_HISTORY_ACTIONS } from "data/orders/historyActions.data";
import { SalesPortalPage } from "../sales-portal.page";

export class HistoryTab extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#history");

  readonly dataContainer = this.uniqueElement.locator("#history-body");
  readonly accordionButtons = this.dataContainer.locator("button.accordion-button");
  readonly historyRowBy = (indexOrAction: number | ORDER_HISTORY_ACTIONS = 0) => {
    return typeof indexOrAction === "number"
      ? this.dataContainer.locator("div.accordion").nth(indexOrAction)
      : this.dataContainer.locator("div.accordion", {
          has: this.page.locator("span.his-col", { hasText: indexOrAction }),
        });
  };
  readonly accordionButtonBy = (indexOrAction: number | ORDER_HISTORY_ACTIONS = 0) =>
    this.historyRowBy(indexOrAction).locator("button.accordion-button");

  readonly historyRowHeader = (indexOrAction: number | ORDER_HISTORY_ACTIONS = 0) =>
    this.historyRowBy(indexOrAction).locator("span.his-col");

  readonly historyEntitiDataRows = (indexOrAction: number | ORDER_HISTORY_ACTIONS = 0) =>
    this.historyRowBy(indexOrAction).locator(".mb-3 .py-3");

  async expandHistoryRow(indexOrAction: number | ORDER_HISTORY_ACTIONS = 0) {
    await this.accordionButtonBy(indexOrAction).click();
  }

  async getRowDescrition(indexOrAction: number | ORDER_HISTORY_ACTIONS = 0) {
    const [action, performer, date] = await this.historyRowHeader(indexOrAction).allInnerTexts();
    return { action, performer, date };
  }

  async getRowData(indexOrAction: number | ORDER_HISTORY_ACTIONS = 0) {
    const dataRows = await this.historyEntitiDataRows(indexOrAction).all();
    const rowsData: Record<string, { previous: string; updated: string }> = {};
    for (let i = 1; i < dataRows.length; i++) {
      const row = dataRows[i];

      if (!row) continue;

      const spans = await row.locator("span.his-col").allInnerTexts();

      if (spans.length >= 3 && spans[0] && spans[1] && spans[2]) {
        const key = spans[0].trim();
        const previous = spans[1].trim();
        const updated = spans[2].trim();

        if (key) {
          rowsData[key] = { previous, updated };
        }
      }
    }

    return Object.keys(rowsData).reduce<Record<"previous" | "updated", Record<string, string>>>(
      (acc, key) => {
        acc["previous"][key] = rowsData[key]!.previous;
        acc["updated"][key] = rowsData[key]!.updated;
        return acc;
      },
      { previous: {}, updated: {} }
    );
  }

  async getHistoryRowData(indexOrAction: number | ORDER_HISTORY_ACTIONS = 0) {
    const [description, data] = await Promise.all([
      this.getRowDescrition(indexOrAction),
      this.getRowData(indexOrAction),
    ]);
    return { description, data };
  }
}
