import { NotificationService } from 'utils/notifications/notifications.service';
import { TelegramService } from 'utils/notifications/telegram.service';

export default async function () {
  if (!process.env.CI) return;

  const notificationService = new NotificationService(new TelegramService());

  await notificationService.postNotification(`Test run finished!
    
Link to deployed report:

https://tatianamosk77.github.io/aqa-4-playwright/allure-report/#`);
}
