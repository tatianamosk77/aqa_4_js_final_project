import { test } from 'fixtures/api.fixture';
import { STATUS_CODES } from 'data/statusCodes';
import { validateResponse } from 'utils/validation/validateResponse.utils';
import { TAGS } from 'data/tags';
import { getNotificationsResponseSchema } from 'data/schemas/notifications/getNotifications.schema';

test.describe('[API] [Sales Portal] [Notifications]', () => {
  let token = '';

  test(
    'Read all notifications',
    {
      tag: [TAGS.REGRESSION, TAGS.NOTIFICATIONS, TAGS.API],
    },
    async ({ loginApiService, notificationsApi }) => {
      token = await loginApiService.loginAsAdmin();

      const getNotificationsResponse = await notificationsApi.readAll(token);
      validateResponse(getNotificationsResponse, {
        status: STATUS_CODES.OK,
        schema: getNotificationsResponseSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });
    }
  );
});
