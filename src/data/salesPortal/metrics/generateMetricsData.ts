import { IMetricsResponse } from "data/types/metrics.types";

const DEFAULT_METRICS = {
  ORDERS: {
    TOTAL_REVENUE: 50000,
    TOTAL_ORDERS: 150,
    AVERAGE_ORDER_VALUE: 333,
    TOTAL_CANCELED_ORDERS: 10,
  },
  CUSTOMERS: {
    TOTAL_NEW_CUSTOMERS: 25,
  },
  DATE_RANGE: {
    START_YEAR: 2025,
    START_MONTH: 10,
    START_DAY: 30,
    DAYS_COUNT: 15,
    DAYS_IN_MONTH: 30,
  },
} as const;

export function generateMetricsData(overrides?: Partial<IMetricsResponse>): IMetricsResponse {
  const baseMetrics: IMetricsResponse = {
    IsSuccess: true,
    Metrics: {
      orders: {
        totalRevenue: DEFAULT_METRICS.ORDERS.TOTAL_REVENUE,
        totalOrders: DEFAULT_METRICS.ORDERS.TOTAL_ORDERS,
        averageOrderValue: DEFAULT_METRICS.ORDERS.AVERAGE_ORDER_VALUE,
        totalCanceledOrders: DEFAULT_METRICS.ORDERS.TOTAL_CANCELED_ORDERS,
        recentOrders: [],
        ordersCountPerDay: [],
      },
      customers: {
        totalNewCustomers: DEFAULT_METRICS.CUSTOMERS.TOTAL_NEW_CUSTOMERS,
        topCustomers: [],
        customerGrowth: generateCustomerGrowthData(),
      },
      products: {
        topProducts: [],
      },
    },
    ErrorMessage: null,
  };

  return deepMerge(baseMetrics, overrides);
}

function generateCustomerGrowthData() {
  const { START_YEAR, START_MONTH, START_DAY, DAYS_COUNT, DAYS_IN_MONTH } = DEFAULT_METRICS.DATE_RANGE;

  return Array.from({ length: DAYS_COUNT }, (_, index) => {
    const daysFromStart = index;
    const month = START_MONTH + Math.floor(daysFromStart / DAYS_IN_MONTH);
    const day = START_DAY + (daysFromStart % DAYS_IN_MONTH);

    return {
      date: {
        year: START_YEAR,
        month,
        day,
      },
      count: 0,
    };
  });
}

function deepMerge(target: any, source: any): any {
  if (typeof target !== "object" || target === null) return source;
  if (typeof source !== "object" || source === null) return target;

  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === "object" && !Array.isArray(source[key])) {
        result[key] = deepMerge(target[key], source[key]);
      } else {
        result[key] = source[key];
      }
    }
  }
  return result;
}
