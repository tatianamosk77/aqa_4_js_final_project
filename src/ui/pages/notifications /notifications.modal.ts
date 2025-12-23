// import { Locator, Page, expect } from '@playwright/test';
// import { logStep } from 'utils/report/logStep.utils';

// export class NotificationsModal {
//   constructor(private readonly page: Page) {}

//   readonly modal = this.page.getByRole('dialog').first();
//   readonly modalTitle = this.modal.getByRole('heading');

//   readonly items = this.modal.locator('[data-testid="notification-item"], .notification-item, .toast, li');
//   readonly closeButton = this.modal.getByRole('button', { name: /close/i });

//   @logStep('Wait for Notifications modal opened')
//   async waitForOpened() {
//     await expect(this.modal).toBeVisible();
//   }

//   @logStep('Wait for Notifications modal closed')
//   async waitForClosed() {
//     await expect(this.modal).toBeHidden();
//   }
// }
