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
  [key: string]: any; // временно
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
  assignedManager: string | null;
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
}

export interface IOrder {
  _id: string;
  status: string;
  customer: string;
  products: IOrderProduct[];
  delivery: IOrderDelivery | null;
  total_price: number;
  createdOn: string;
  comments: any[];
  history: IOrderHistoryItem[];
  assignedManager: IAssignedManager | string | null;
}
