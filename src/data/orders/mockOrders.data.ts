import { COUNTRIES } from 'data/salesPortal/customers/countries';
import { MANUFACTURERS } from 'data/salesPortal/products/manufacturers';
import { ICustomerFromResponse } from 'data/types/customer.types';
import {
  IAssignedManager,
  IOrderDelivery,
  IOrderHistoryItem,
  IOrderFromResponse,
  IOrderFilteredResponse,
  IHistoryPerformer,
 // ICommentFromResponse,
} from 'data/types/order.types';
import { IProductFromResponse } from 'data/types/product.types';
import { generateID } from 'utils/generateID.utils';

import { DELIVERY } from './delivery.data';
import { ORDER_HISTORY_ACTIONS } from './historyActions.data';
import { ROLES } from './roles.data';
import { ORDER_STATUS } from './statuses.data';

// Моковый менеджер для order.assignedManager (IAssignedManager) — БЕЗ roles
export const MOCK_MANAGER_PAVEL: IAssignedManager = {
  _id: '680d4d7dd006ba3d475ff67b',
  username: 'PavelKhalkov',
  firstName: 'Pavel',
  lastName: 'Khalkov',
  createdOn: '2025/12/21 22:18:59',
};

// Моковый performer для history[].performer (IHistoryPerformer) — roles ОБЯЗАТЕЛЕН
export const MOCK_HISTORY_PERFORMER_PAVEL: IHistoryPerformer = {
  _id: '680d4d7dd006ba3d475ff67b',
  username: 'PavelKhalkov',
  firstName: 'Pavel',
  lastName: 'Khalkov',
  roles: [ROLES.USER],
  createdOn: '2025/12/21 22:18:59',
};

// Моковые клиенты (ICustomerFromResponse)
export const MOCK_CUSTOMER_ALICE: ICustomerFromResponse = {
  _id: generateID(),
  name: 'Alice Smith',
  email: 'alice.smith@example.com',
  country: COUNTRIES.USA,
  city: 'New York',
  street: 'Main St',
  house: 123,
  flat: 4,
  phone: '123-456-7890',
  notes: 'Regular customer.',
 // role: 'User',
  createdOn: '2025-12-01T08:00:00Z',
};

export const MOCK_CUSTOMER_BOB: ICustomerFromResponse = {
  _id: generateID(),
  name: 'Bob Johnson',
  email: 'bob.johnson@example.com',
  country: COUNTRIES.CANADA,
  city: 'Toronto',
  street: 'Maple Ave',
  house: 45,
  flat: 10,
  phone: '098-765-4321',
  notes: 'VIP customer.',
 // role: 'Admin',
  createdOn: '2025-12-10T09:30:00Z',
};

export const MOCK_CUSTOMER_CHARLIE: ICustomerFromResponse = {
  _id: generateID(),
  name: 'Charlie Brown',
  email: 'charlie.brown@example.com',
  country: COUNTRIES.USA,
  city: 'Los Angeles',
  street: 'Sunset Blvd',
  house: 789,
  flat: 12,
  phone: '111-222-3333',
  notes: 'New customer.',
 // role: 'User',
  createdOn: '2025-12-15T11:45:00Z',
};

// Моковые продукты (IProductFromResponse)
export const MOCK_PRODUCT_TWO: IProductFromResponse = {
  _id: generateID(),
  name: 'New Product Two',
  price: 99.99,
  manufacturer: MANUFACTURERS.SAMSUNG,
  amount: 5,
  notes: 'Standard product notes.',
  createdOn: '2025-01-15T09:30:00Z',
};

export const MOCK_PRODUCT_ONE: IProductFromResponse = {
  _id: generateID(),
  name: 'New Product One',
  price: 49.99,
  manufacturer: MANUFACTURERS.APPLE,
  amount: 2,
  notes: 'Advanced product features.',
  createdOn: '2025-02-20T14:00:00Z',
};

export const MOCK_PRODUCT_THREE: IProductFromResponse = {
  _id: generateID(),
  name: 'New Product Three',
  price: 1234.0,
  manufacturer: MANUFACTURERS.APPLE,
  amount: 1,
  notes: 'Internal testing notes.',
  createdOn: '2025-05-20T01:20:00Z',
};

// Моковая доставка (IOrderDelivery)
export const MOCK_DELIVERY_EXAMPLE: IOrderDelivery = {
  finalDate: '2025-07-15T00:00:00Z',
  condition: DELIVERY.DELIVERY,
  address: {
    country: COUNTRIES.USA,
    city: 'New York',
    street: 'Main St',
    house: 123,
    flat: 4,
  },
};


// Моковый комментарий (ICommentFromResponse)
// export const MOCK_COMMENT_INITIAL: ICommentFromResponse = {
//   _id: generateID(),
//   text: 'Initial comment on order',
//   createdOn: '2025-07-01T10:05:00Z',
// };

// Моковая история (IOrderHistoryItem)
export const MOCK_HISTORY_CREATED_ALICE: IOrderHistoryItem = {
  action: ORDER_HISTORY_ACTIONS.CREATED,
  status: ORDER_STATUS.DRAFT,
  customer: MOCK_CUSTOMER_ALICE.name,
  products: [{ ...MOCK_PRODUCT_TWO, received: false }],
  total_price: MOCK_PRODUCT_TWO.price,
  delivery: null,
  changedOn: '2025-07-01T10:00:00Z',
  performer: MOCK_HISTORY_PERFORMER_PAVEL,
  assignedManager: null,
};

// export const MOCK_COMMENT_INITIAL: ICommentFromResponse = {
//   _id: generateID(),
//   text: 'Initial comment on order',
//   createdOn: '2025-07-01T10:05:00Z',
// };

// Моковые ордера (IOrderFromResponse)
export const MOCK_ORDER_IN_PROCESS: IOrderFromResponse = {
  _id: generateID(),
  status: ORDER_STATUS.IN_PROCESS,
  customer: MOCK_CUSTOMER_ALICE,
  products: [
    { ...MOCK_PRODUCT_TWO, received: false },
    { ...MOCK_PRODUCT_ONE, received: false },
  ],
  delivery: MOCK_DELIVERY_EXAMPLE,
  total_price: MOCK_PRODUCT_TWO.price + MOCK_PRODUCT_ONE.price,
  createdOn: '2025-07-01T09:00:00Z',
  history: [MOCK_HISTORY_CREATED_ALICE],
  comments: [], 
  assignedManager: MOCK_MANAGER_PAVEL,
};


export const MOCK_ORDER_DRAFT: IOrderFromResponse = {
  _id: generateID(),
  status: ORDER_STATUS.DRAFT,
  customer: MOCK_CUSTOMER_BOB,
  products: [{ ...MOCK_PRODUCT_TWO, received: false }],
  delivery: null,
  total_price: MOCK_PRODUCT_TWO.price,
  createdOn: '2025-07-02T10:00:00Z',
  history: [
    {
      ...MOCK_HISTORY_CREATED_ALICE,
      customer: MOCK_CUSTOMER_BOB.name,
      status: ORDER_STATUS.DRAFT,
      products: [{ ...MOCK_PRODUCT_TWO, received: false }],
    },
  ],
  comments: [],
  assignedManager: null,
};

export const MOCK_ORDER_CANCELED: IOrderFromResponse = {
  _id: generateID(),
  status: ORDER_STATUS.CANCELED,
  customer: MOCK_CUSTOMER_CHARLIE,
  products: [{ ...MOCK_PRODUCT_ONE, received: true }],
  delivery: MOCK_DELIVERY_EXAMPLE,
  total_price: MOCK_PRODUCT_ONE.price,
  createdOn: '2025-07-03T11:00:00Z',
  history: [
    {
      ...MOCK_HISTORY_CREATED_ALICE,
      customer: MOCK_CUSTOMER_CHARLIE.name,
      status: ORDER_STATUS.CANCELED,
      products: [{ ...MOCK_PRODUCT_ONE, received: true }],
    },
  ],
  comments: [], 
  assignedManager: null,
};

// API Response Mocks
export const MOCK_ORDERS_LIST_API_RESPONSE: IOrderFilteredResponse = {
  Orders: [MOCK_ORDER_IN_PROCESS, MOCK_ORDER_DRAFT, MOCK_ORDER_CANCELED],
  ErrorMessage: null,
  IsSuccess: true,
  total: 3,
  page: 1,
  limit: 10,
  search: '',
  status: [],
  sorting: {
    sortField: 'createdOn',
    sortOrder: 'desc',
  },
};
