export interface IMetricsOrders {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCanceledOrders: number;
  recentOrders: any[];
  ordersCountPerDay: any[];
}

export interface ICustomerGrowth {
  date: {
    year: number;
    month: number;
    day: number;
  };
  count: number;
}

export interface IMetricsCustomers {
  totalNewCustomers: number;
  topCustomers: any[];
  customerGrowth: ICustomerGrowth[];
}

export interface IMetricsProducts {
  topProducts: any[];
}

export interface IMetricsResponse {
  IsSuccess: boolean;
  Metrics: {
    orders: IMetricsOrders;
    customers: IMetricsCustomers;
    products: IMetricsProducts;
  };
  ErrorMessage: string | null;
}
