import { IMetricsResponse } from "data/types/metrics.types";

export class HomeMetricsTestBuilder {
  private metrics: IMetricsResponse;

  private constructor() {
    this.metrics = this.createBaseMetrics();
  }

  static create(): HomeMetricsTestBuilder {
    return new HomeMetricsTestBuilder();
  }

  private createBaseMetrics(): IMetricsResponse {
    return {
      IsSuccess: true,
      Metrics: {
        orders: {
          totalRevenue: 50000,
          totalOrders: 150,
          averageOrderValue: 333,
          totalCanceledOrders: 10,
          recentOrders: [],
          ordersCountPerDay: [],
        },
        customers: {
          totalNewCustomers: 25,
          topCustomers: [],
          customerGrowth: Array.from({ length: 15 }, (_, i) => ({
            date: {
              year: 2025,
              month: 10 + Math.floor(i / 30),
              day: 30 + (i % 30),
            },
            count: 0,
          })),
        },
        products: {
          topProducts: [],
        },
      },
      ErrorMessage: null,
    };
  }

  withOrdersThisYear(value: number): this {
    this.metrics.Metrics.orders.totalOrders = value;
    return this;
  }

  withNewCustomers(value: number): this {
    this.metrics.Metrics.customers.totalNewCustomers = value;
    return this;
  }

  withCanceledOrders(value: number): this {
    this.metrics.Metrics.orders.totalCanceledOrders = value;
    return this;
  }

  withTotalRevenue(value: number): this {
    this.metrics.Metrics.orders.totalRevenue = value;
    return this;
  }

  withAvgOrderValue(value: number): this {
    this.metrics.Metrics.orders.averageOrderValue = value;
    return this;
  }

  withCustomMetrics(customizer: (metrics: IMetricsResponse) => void): this {
    customizer(this.metrics);
    return this;
  }

  build(): IMetricsResponse {
    return this.metrics;
  }
}
