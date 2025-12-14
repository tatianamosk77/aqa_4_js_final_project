import { COUNTRIES } from "data/salesPortal/customers/countries";
import { ID, IResponseFields, SortOrder } from "./core.types";
import { ICustomerOrder, IOrder } from "./order.types";

export interface ICustomer {
  email: string;
  name: string;
  country: COUNTRIES;
  city: string;
  flat: number;
  house: number;
  notes?: string;
  phone: string;
  street: string;
}

export interface ICreatedOn {
  createdOn: string;
}

export interface ICustomerInTable
  extends Pick<ICustomer, "email" | "name" | "country">, ICreatedOn {}
export interface ICustomerDetails extends Required<ICustomer>, ICreatedOn {}

export interface ICustomerFromResponse extends Required<ICustomer>, ICreatedOn, ID {}

export interface ICustomerResponse extends IResponseFields {
  Customer: ICustomerFromResponse;
}

export interface ICustomersResponse extends IResponseFields {
  Customers: ICustomerFromResponse[];
}
export interface ICustomerOrdersResponse extends IResponseFields {
  Orders: IOrder[];
}

export interface ICustomersSortedResponse extends ICustomersResponse {
  total: number;
  page: number;
  limit: number;
  search: string;
  country: string[];
  sorting: {
    sortField: CustomersSortField;
    sortOrder: SortOrder;
  };
}
export type CustomersSortField = "createdOn" | "country" | "email" | "name";

export interface IGetCustomersParams {
  country: COUNTRIES[];
  search: string;
  sortField: CustomersSortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}
export type CustomerTableHeader = "Email" | "Name" | "Country" | "Created On";
export interface ICustomerOrdersByIdResponse extends IResponseFields {
  Orders: ICustomerOrder[];
}
