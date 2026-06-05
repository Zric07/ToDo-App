import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { DatabaseService } from './services/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAppInitializer(async () => {
      const db = inject(DatabaseService);
      await db.init();
      await checkDailyReset(db);
    })
  ]

};

async function checkDailyReset(db: DatabaseService) {
    const today = new Date().toDateString();
    const lastReset = localStorage.getItem('lastDailyReset');
    if (lastReset !== today) {
        await db.resetDailyTasks();
        localStorage.setItem('lastDailyReset', today);
    }
}