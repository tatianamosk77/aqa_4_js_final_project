import { test as base } from "@playwright/test";
import { ApiMock } from "../mock/apiMock";

export type MockFixture = {
  mock: ApiMock;
};

export const test = base.extend<MockFixture>({
  mock: async ({ page }, use) => {
    await use(new ApiMock(page));
  },
});
