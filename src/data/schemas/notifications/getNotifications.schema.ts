import { obligatoryFieldsSchema, obligatoryRequredFields } from '../core.schema';
import { notificationSchema } from './notification.schema';

export const getNotificationsResponseSchema = {
  type: 'object',
  properties: {
    Notifications: {
      type: 'array',
      items: {
        ...notificationSchema,
      },
    },
    ...obligatoryFieldsSchema,
  },
  required: ['Notifications', ...obligatoryRequredFields],
};
