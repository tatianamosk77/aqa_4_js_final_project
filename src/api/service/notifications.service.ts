import { NotificationsApi } from 'api/api/notifications.api';
import { getNotificationsResponseSchema } from 'data/schemas/notifications/getNotifications.schema';
import { STATUS_CODES } from 'data/statusCodes';
import { INotificationFromResponse } from 'data/types/notification.type';
import { logStep } from 'utils/report/logStep.utils';
import { validateResponse } from 'utils/validation/validateResponse.utils';

export class NotificationsApiService {
  constructor(private notificationsApi: NotificationsApi) {}

  @logStep('Get notificationId from the getAllNotifications request')
  async getId(token: string) {
    const response = await this.notificationsApi.get(token);

    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getNotificationsResponseSchema,
    });

    return response.body.Notifications as INotificationFromResponse[];
  }
}
