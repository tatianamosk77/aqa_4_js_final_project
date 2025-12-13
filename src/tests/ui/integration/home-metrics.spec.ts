import { test, expect } from "fixtures/business.fixture";
import { SALES_PORTAL_URL } from "config/env";
import numeral from "numeral";
import { HomeMetricsTestBuilder } from "utils/homeMetricsHelper";
import { TAGS } from "data/tags";

test.describe("[Integration] [Sales Portal] [Home Metrics]", () => {
  test(
    "Orders This Year metric",
    {
      tag: [TAGS.VISUAL_REGRESSION, TAGS.PRODUCTS, TAGS.INTEGRATION],
    },
    async ({ loginAsAdmin, homePage, mock }) => {
      const expectedOrdersThisYear = 150;
      const mockData = HomeMetricsTestBuilder.create()
        .withOrdersThisYear(expectedOrdersThisYear)
        .build();

      await mock.homePageMetrics(mockData);
      await loginAsAdmin();
      await homePage.open();
      await homePage.waitForOpened();

      const actualOrdersThisYear = await homePage.getOrdersThisYearMetric();
      expect(actualOrdersThisYear).toBe(expectedOrdersThisYear);
    }
  );

  test(
    "New Customers metric",
    {
      tag: [TAGS.VISUAL_REGRESSION, TAGS.PRODUCTS, TAGS.INTEGRATION],
    },
    async ({ loginAsAdmin, homePage, mock }) => {
      const expectedNewCustomers = 42;

      const mockData = HomeMetricsTestBuilder.create()
        .withNewCustomers(expectedNewCustomers)
        .build();

      await mock.homePageMetrics(mockData);
      await loginAsAdmin();
      await homePage.open();
      await homePage.waitForOpened();

      const actualNewCustomers = await homePage.getNewCustomersMetric();
      expect(actualNewCustomers).toBe(expectedNewCustomers);
    }
  );

  test(
    "Canceled Orders metric",
    {
      tag: [TAGS.VISUAL_REGRESSION, TAGS.PRODUCTS, TAGS.INTEGRATION],
    },
    async ({ loginAsAdmin, homePage, page, mock }) => {
      const expectedCanceledOrders = 8;

      const mockData = HomeMetricsTestBuilder.create()
        .withCanceledOrders(expectedCanceledOrders)
        .build();

      await mock.homePageMetrics(mockData);
      await loginAsAdmin();
      await page.goto(SALES_PORTAL_URL);
      await homePage.waitForOpened();

      const actualCanceledOrders = await homePage.getCanceledOrdersMetric();
      expect(actualCanceledOrders).toBe(expectedCanceledOrders);
    }
  );

  test(
    "Total Revenue metric",
    {
      tag: [TAGS.VISUAL_REGRESSION, TAGS.PRODUCTS, TAGS.INTEGRATION],
    },
    async ({ loginAsAdmin, homePage, page, mock }) => {
      const expectedTotalRevenue = 50000;

      const mockData = HomeMetricsTestBuilder.create()
        .withTotalRevenue(expectedTotalRevenue)
        .build();

      await mock.homePageMetrics(mockData);
      await loginAsAdmin();
      await page.goto(SALES_PORTAL_URL);
      await homePage.waitForOpened();

      const actualTotalRevenue = await homePage.getTotalRevenueMetric();
      const expectedFormatted = numeral(expectedTotalRevenue).format("0.0a");
      expect(actualTotalRevenue).toBe(`$${expectedFormatted}`);
    }
  );

  test(
    "Avg Order Value metric",
    {
      tag: [TAGS.REGRESSION, TAGS.PRODUCTS, TAGS.INTEGRATION],
    },
    async ({ loginAsAdmin, homePage, page, mock }) => {
      const expectedAvgOrderValue = 375;

      const mockData = HomeMetricsTestBuilder.create()
        .withAvgOrderValue(expectedAvgOrderValue)
        .build();

      await mock.homePageMetrics(mockData);
      await loginAsAdmin();
      await page.goto(SALES_PORTAL_URL);
      await homePage.waitForOpened();

      const actualAvgOrderValue = await homePage.getAvgOrderValueMetric();
      const expectedFormatted = numeral(expectedAvgOrderValue).format("0.0a");
      expect(actualAvgOrderValue).toBe(`$${expectedFormatted}`);
    }
  );
});
