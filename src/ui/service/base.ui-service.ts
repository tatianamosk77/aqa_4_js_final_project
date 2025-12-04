import { Page } from "@playwright/test";

export abstract class BaseUIService {
  constructor(protected readonly page: Page) {}
}
