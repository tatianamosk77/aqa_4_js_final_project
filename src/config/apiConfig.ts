import { SALES_PORTAL_API_URL } from './env';

export const apiConfig = {
  baseURL: SALES_PORTAL_API_URL,
  endpoints: {
    products: '/api/products',
    productById: (id: string) => `/api/products/${id}/`,
    productsAll: '/api/products/all',
    login: '/api/login',
    customers: '/api/customers',
    customerById: (id: string) => `/api/customers/${id}/`,
    customerOrders: (id: string) => `/api/customers/${id}/orders/`,

    customersAll: '/api/customers/all',

    metrics: '/api/metrics',
  },
};
