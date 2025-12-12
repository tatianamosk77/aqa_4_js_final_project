import { NotificationsApi } from 'api/api/notifications.api';
import { getNotificationsResponseSchema } from 'data/schemas/notifications/getNotifications.schema';
import { STATUS_CODES } from 'data/statusCodes';
import { INotificationFromResponse, INotificationResponse } from 'data/types/notification.type';

import { logStep } from 'utils/report/logStep.utils';
import { validateResponse } from 'utils/validation/validateResponse.utils';

export class NotificationsApiService {
  constructor(private notificationsApi: NotificationsApi) {}

  @logStep('Get all notifications')
  async getAll(token: string): Promise<INotificationResponse> {
    const response = await this.notificationsApi.get(token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getNotificationsResponseSchema,
    });
    return response.body as INotificationResponse;
  }

  @logStep('Get notifications array')
  async getNotificationsArray(token: string): Promise<INotificationFromResponse[]> {
    const response = await this.getAll(token);
    return response.Notifications;
  }

  @logStep('Get first unread notification ID')
  async getFirstUnreadNotificationId(token: string): Promise<string | null> {
    const response = await this.getAll(token);

    const unreadNotification = response.Notifications.find(notification => !notification.read);

    return unreadNotification ? unreadNotification._id : null;
  }

  @logStep('Get first notification ID')
  async getFirstNotificationId(token: string): Promise<string | null> {
    const response = await this.getAll(token);

    if (
      !response.Notifications ||
      !Array.isArray(response.Notifications) ||
      response.Notifications.length === 0
    ) {
      return null;
    }

    const firstNotification = response.Notifications[0];
    return firstNotification ? firstNotification._id : null;
  }

  @logStep('Mark notification as read')
  async markAsRead(token: string, notificationId: string): Promise<INotificationResponse> {
    const response = await this.notificationsApi.readOne(notificationId, token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getNotificationsResponseSchema,
    });

    return response.body as INotificationResponse;
  }

  @logStep('Mark all notifications as read')
  async markAllAsRead(token: string): Promise<INotificationResponse> {
    const response = await this.notificationsApi.readAll(token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getNotificationsResponseSchema,
    });

    return response.body as INotificationResponse;
  }

  @logStep('Get unread notifications count')
  async getUnreadCount(token: string): Promise<number> {
    const response = await this.getAll(token);

    return response.Notifications.filter(notification => !notification.read).length;
  }

  @logStep('Check for unread notifications')
  async hasUnreadNotifications(token: string): Promise<boolean> {
    const count = await this.getUnreadCount(token);
    return count > 0;
  }

  @logStep('Get notifications by read status')
  async getByReadStatus(token: string, read: boolean): Promise<INotificationFromResponse[]> {
    const response = await this.getAll(token);

    return response.Notifications.filter(notification => notification.read === read);
  }

  @logStep('Get notifications by type')
  async getByType(token: string, type: string): Promise<INotificationFromResponse[]> {
    const response = await this.getAll(token);

    return response.Notifications.filter(notification => notification.type === type);
  }
}
