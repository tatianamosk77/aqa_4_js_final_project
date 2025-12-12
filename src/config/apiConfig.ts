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
    notifications: '/api/notifications',
    readNotification: (id: string) => `/api/notifications/${id}/read`,
    readAllNotifications: '/api/notifications/mark-all-read',
    orders: '/api/orders', 
    orderById: (id: string) => `/api/orders/${id}/`,
    orderReceive: (id: string) => `/api/orders/${id}/receive`,
    orderDelivery: (id: string) => `/api/orders/${id}/delivery`,
    orderStatus: (id: string) => `/api/orders/${id}/status`,
    orderComment: (id: string) => `/api/orders/${id}/comments`,
    orderDelete: (id: string) => `/api/orders/${id}/`,
    orderCommentById: (orderId: string, commentId: string) => `/api/orders/${orderId}/comments/${commentId}`,
    orderAssignManager: (orderId: string, managerId: string) => `/api/orders/${orderId}/assign-manager/${managerId}`,
    orderUnassignManager: (orderId: string) => `/api/orders/${orderId}/unassign-manager`
  },
};
