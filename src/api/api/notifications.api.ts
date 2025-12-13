import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import { INotificationResponse } from "data/types/notification.type";
import { logStep } from "utils/report/logStep.utils";

export class NotificationsApi {
  constructor(private apiClient: IApiClient) {}

  @logStep("GET /api/notifications")
  async get(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL, //backend url
      url: apiConfig.endpoints.notifications, //endpoint address
      method: "get",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    return await this.apiClient.send<INotificationResponse>(options);
  }

  @logStep("PATCH /api/notifications/{notificationId}/read")
  async readOne(_id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.readNotification(_id),
      method: "patch",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    return await this.apiClient.send<INotificationResponse>(options);
  }

  @logStep("PATCH /api/notifications/mark-all-read")
  async readAll(token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.readAllNotifications,
      method: "patch",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    return await this.apiClient.send<INotificationResponse>(options);
  }
}
