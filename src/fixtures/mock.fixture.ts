import { test as base } from "@playwright/test";
import { Mock } from "../mock/mock"; 

export type MockFixture = {
  mock: Mock;
};

export const test = base.extend<MockFixture>({
  mock: async ({ page }, use) => {
    await use(new Mock(page));
  },
});
