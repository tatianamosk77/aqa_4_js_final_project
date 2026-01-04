import { defineConfig, devices } from "@playwright/test";
import dotenv from 'dotenv';
import path from 'path';

/**
 * Определяем, какой файл загружать (.env или .env.dev).
 * process.cwd() — это корень твоего проекта (D:\Work\Repos\aqa_4_js_final_project).
 */
const envFile = process.env.TEST_ENV ? `.env.${process.env.TEST_ENV}` : '.env';
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

export default defineConfig({
  globalTeardown: "./src/config/global.teardown",
  testDir: "./src/tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 5,
  timeout: 30000,

  reporter: [
    ["html"],
    ["list"],
    [
      "allure-playwright",
      {
        suiteTitle: false,
        environmentInfo: {
          UI_URL: process.env.SALES_PORTAL_URL,
          API_URL: process.env.SALES_PORTAL_API_URL,
        },
      },
    ],
  ],

  use: {
    // Берёт URL из загруженного .env файла
    baseURL: process.env.SALES_PORTAL_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
    headless: true,
  },

  projects: [
    {
      name: "setup",
      use: { ...devices["Desktop Chrome"] },
      testDir: "src/tests/ui/sales-portal",
      testMatch: /\.setup\.ts/,
    },
    {
      name: "sales-portal-ui",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1920, height: 1080 },
        storageState: "src/.auth/user.json",
      },
      dependencies: ["setup"],
      testDir: "src/tests/ui/sales-portal",
    },
    {
      name: "sales-portal-api",
      use: { ...devices["Desktop Chrome"] },
      testDir: "src/tests/api",
    },
    {
      name: "sales-portal-ui-integration",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "src/.auth/user.json",
      },
      dependencies: ["setup"],
      testDir: "src/tests/ui/integration",
    },
    {
      name: "sales-portal-e2e",
      use: {
        ...devices["Desktop Chrome"],
        storageState: "src/.auth/user.json",
      },
      dependencies: ["setup"],
      testDir: "src/tests/ui/E2E",
    },
  ],



    // {
    //   name: "chromium",
    //   use: { ...devices["Desktop Chrome"], headless: true },
    // },
    // {
    //   name: "firefox",
    //   use: { ...devices["Desktop Firefox"] },
    // },

    // {
    //   name: "webkit",
    //   use: { ...devices["Desktop Safari"] },
    // },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  // ],

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
