import { IResponseFields, SortOrder } from "data/types/core.types";
import { IProduct } from "./product.types";
import { ORDER_STATUS } from "data/orders/statuses.data";
import { COUNTRIES } from "data/salesPortal/customers/countries";
import { DELIVERY, LOCATION } from "data/orders/delivery.data";
import { ICustomerFromResponse } from "./customer.types";

export interface IOrderProduct {
  _id: string;
  name: string;
  amount: number;
  price: number;
  manufacturer: string;
  notes: string;
  received: boolean;
}

export interface IOrderDelivery {
  finalDate: string;
  condition: DELIVERY;
  address: IAddress;
}

export interface IOrderHistoryItem {
  status: string;
  customer: string;
  products: IOrderProduct[];
  total_price: number;
  delivery: IOrderDelivery | null;
  changedOn: string;
  action: string;
  performer: IHistoryPerformer;
  assignedManager: IAssignedManager | string | null; // ⬅ было string | null
}

export interface IHistoryPerformer {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  roles: string[];
  createdOn: string;
}

export interface IAssignedManager {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  createdOn: string; // ⬅ добавлено, т.к. приходит в ответе
}

export interface IOrderData {
  customer: string;
  products: string[];
}

export interface IOrderDataWithId extends IOrderData {
  _id: string;
}

export interface IOrderData {
  customer: string;
  products: string[];
}

export interface IOrderDataWithId extends IOrderData {
  _id: string;
}

export interface IOrder {
  _id: string;
  status: string;
  customer: ICustomerFromResponse;
  products: IOrderProduct[];
  delivery: IOrderDelivery | null;
  total_price: number;
  createdOn: string;
  comments: any[];
  history: IOrderHistoryItem[];
  assignedManager: IAssignedManager | string | null;
}

export interface IOrderFromResponse extends IOrder {
  readonly _id: string;
}

export interface IProductFromOrder extends IProduct {
  _id: string;
  received: boolean;
}

export interface IAddress {
  location?: LOCATION;
  country?: COUNTRIES;
  city?: string;
  street?: string;
  house?: number;
  flat?: number;
}

export interface IOrderFilteredResponse extends IResponseFields {
  Orders: IOrderFromResponse[];
  total: number;
  page: number;
  limit: number;
  search: string;
  status: ORDER_STATUS[];
  sorting: {
    sortField: OrdersSortField;
    sortOrder: SortOrder;
  };
}

export interface IOrderRequestParams extends Record<
  string,
  string | number | string[] | undefined
> {
  page?: number;
  limit?: number;
  search?: string;
  status?: ORDER_STATUS | ORDER_STATUS[];
  sortField?: OrdersSortField;
  sortOrder?: SortOrder;
  managerIds?: string[];
}

export interface IOrderResponse extends IResponseFields {
  Order: IOrderFromResponse;
}
export interface IOrdersResponse extends IResponseFields {
  Orders: IOrderFromResponse[];
}
export interface ICustomerOrder extends Omit<IOrder, "customer"> {
  customer: string;
}

export interface IOrdersSortedResponse extends IOrdersResponse {
  total: number;
  page: number;
  limit: number;
  search: string;
  status: string[];
  sorting: {
    sortField: OrdersSortField;
    sortOrder: SortOrder;
  };
}

// export type OrdersSortField = "createdOn" | "status" | "assignedManager" | "orderId" | "delivery" | "totalPrice" | "email";

export type OrdersSortField =
  | "orderNumber"
  | "email"
  | "price"
  | "delivery"
  | "status"
  | "assignedManager"
  | "createdOn";
export interface IGetOrdersParams {
  status: ORDER_STATUS[];
  search: string;
  sortField: OrdersSortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}
export interface ICreatedOn {
  createdOn: string;
}

export type OrdersTableHeader =
  | "Order Number"
  | "Email"
  | "Price"
  | "Delivery"
  | "Status"
  | "Assigned Manager"
  | "Created On";

export interface IOrderInTable {
  orderNumber: string;
  email: string;
  price: number;
  delivery: string;
  status: string;
  assignedManager: string;
  createdOn: string;
}
