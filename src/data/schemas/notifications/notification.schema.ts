import { NOTIFICATION_TYPES } from "data/salesPortal/notifications/types";

export const notificationSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    userId: { type: "string" },
    type: {
      type: "string",
      enum: Object.values(NOTIFICATION_TYPES),
    },
    orderId: { type: "string" },
    message: { type: "string" },
    read: { type: "boolean" },
    expiresAt: { type: "string", format: "date-time" },
    createdAt: { type: "string", format: "date-time" },
    updatedAt: { type: "string", format: "date-time" },
  },
  required: [
    "_id",
    "userId",
    "type",
    "orderId",
    "message",
    "read",
    "expiresAt",
    "createdAt",
    "updatedAt",
  ],
  additionalProperties: false,
};
