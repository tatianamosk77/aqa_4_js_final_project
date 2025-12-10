import { ID, IResponseFields } from './core.types';

// Базовый интерфейс уведомления
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

// Типы уведомлений (основные из примера, можно расширить)
export type NotificationType =
  | 'commentAdded'
  | 'assigned'
  | 'statusChanged'
  | 'dueDateApproaching'
  | 'paymentReceived'
  | 'newOrder';

// Интерфейс уведомления из ответа API (с ID)
export interface INotificationFromResponse extends INotification, ID {}

// // Для отображения в таблице/списке
// export interface INotificationInTable
//     extends Pick<INotification, 'type' | 'message' | 'read' | 'createdAt'> { }

// // Детали уведомления (полный объект)
// export interface INotificationDetails extends Required<INotification> { }

// Ответ API для одного уведомления
export interface INotificationResponse extends IResponseFields {
  Notification: INotificationFromResponse;
}

// Ответ API для списка уведомлений (как в примере)
export interface INotificationsResponse extends IResponseFields {
  Notifications: INotificationFromResponse[];
}
