import { test as base, expect } from '@playwright/test';
import { RequestApi } from 'api/apiClients/requestApi';
import { ProductsApi } from 'api/api/products.api';
import { LoginApi } from 'api/api/login.api';
import { LoginService } from 'api/service/login.service';
import { ProductsApiService } from 'api/service/products.service';
import { CustomersApi } from 'api/api/customers.api';
import { CustomersApiService } from 'api/service/customers.service';
import { NotificationsApi } from 'api/api/notifications.api';
import { OrdersApiService } from 'api/service/orders.service';
import { OrdersApi } from 'api/api/orders.api';

export interface IApi {
  // api
  productsApi: ProductsApi;
  loginApi: LoginApi;
  customersApi: CustomersApi;
  notificationsApi: NotificationsApi;
  ordersApi: OrdersApi;

  //services
  productsApiService: ProductsApiService;
  loginApiService: LoginService;
  customersApiService: CustomersApiService;
  ordersApiService: OrdersApiService;
}

const test = base.extend<IApi>({
  //api
  productsApi: async ({ request }, use) => {
    const apiClient = new RequestApi(request);
    const api = new ProductsApi(apiClient);
    await use(api);
  },

  customersApi: async ({ request }, use) => {
    const apiClient = new RequestApi(request);
    const api = new CustomersApi(apiClient);
    await use(api);
  },

  loginApi: async ({ request }, use) => {
    const apiClient = new RequestApi(request);
    const api = new LoginApi(apiClient);
    await use(api);
  },
  notificationsApi: async ({ request }, use) => {
    const apiClient = new RequestApi(request);
    const api = new NotificationsApi(apiClient);
    await use(api);
  },

  ordersApi: async ({ request }, use) => {
    const apiClient = new RequestApi(request);
    const api = new OrdersApi(apiClient);
    await use(api);
  },

  //services
  productsApiService: async ({ productsApi }, use) => {
    await use(new ProductsApiService(productsApi));
  },

  customersApiService: async ({ customersApi }, use) => {
    await use(new CustomersApiService(customersApi));
  },

  loginApiService: async ({ loginApi }, use) => {
    await use(new LoginService(loginApi));
  },

  ordersApiService: async ({ ordersApi }, use) => {
    await use(new OrdersApiService(ordersApi));
  },
});

export { test, expect };
