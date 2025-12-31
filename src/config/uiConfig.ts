import { SALES_PORTAL_URL } from "./env"; 

export const ROUTES = {
  ORDERS: `${SALES_PORTAL_URL}/orders`,
  ORDER_DETAILS: (id: string) => `${SALES_PORTAL_URL}/orders/${id}`,
  ORDER_EDIT_DELIVERY: (id: string) => `${SALES_PORTAL_URL}/orders/${id}/edit-delivery`,
  ORDER_SCHEDULE_DELIVERY: (id: string) => `${SALES_PORTAL_URL}/orders/${id}/schedule-delivery`,
  CUSTOMERS: `${SALES_PORTAL_URL}/customers`,
  CUSTOMER_DETAILS: (id: string) => `${SALES_PORTAL_URL}/customers/${id}`,
  CUSTOMER_EDIT: (id: string) => `${SALES_PORTAL_URL}/customers/${id}/edit`,
  CUSTOMER_ADD: `${SALES_PORTAL_URL}/customers/add`,
  PRODUCTS: `${SALES_PORTAL_URL}/products`,
  PRODUCT_DETAILS: (id: string) => `${SALES_PORTAL_URL}/products/${id}`,
  PRODUCT_EDIT: (id: string) => `${SALES_PORTAL_URL}/products/${id}/edit`,
  PRODUCT_ADD: `${SALES_PORTAL_URL}/products/add`,
  MANAGERS: `${SALES_PORTAL_URL}/managers`,
  MANAGER_DETAILS: (id: string) => `${SALES_PORTAL_URL}/managers/${id}`,
  MANAGER_EDIT: (id: string) => `${SALES_PORTAL_URL}/managers/${id}/edit`,
  MANAGER_ADD: `${SALES_PORTAL_URL}/managers/add`,
  SIGNIN: `${SALES_PORTAL_URL}/login`,
  HOME: `${SALES_PORTAL_URL}/`,
  NOT_FOUND: `${SALES_PORTAL_URL}/page-not-found`,
};
