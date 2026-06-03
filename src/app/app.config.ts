import { ApplicationConfig, provideAppInitializer, inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { DatabaseService } from './services/database';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        {
            provide: 'DB_INITIALIZED',
            useFactory: () => inject(DatabaseService).init(),
            deps: []
        },
        provideAppInitializer(() => {
            const db = inject(DatabaseService);
            return db.init();
        })
    ]
};