import { ID, IResponseFields } from './core.types';

export interface INotification {
  userId: string;
  type: NotificationType;
  orderId: string;
  message: string;
  read: boolean;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | 'commentAdded'
  | 'assigned'
  | 'statusChanged'
  | 'dueDateApproaching'
  | 'paymentReceived'
  | 'newOrder';

export interface INotificationFromResponse extends INotification, ID {}
export interface INotificationResponse extends IResponseFields {
  Notifications: INotificationFromResponse[];
}
