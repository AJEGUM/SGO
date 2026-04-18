import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

// Importaciones de tu proyecto
import { routes } from './app.routes';
import { authInterceptor } from './auth/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Optimización de detección de cambios (estándar en Angular 18+)
    provideZoneChangeDetection({ eventCoalescing: true }),
    
    // Configuración de rutas
    provideRouter(routes),
    
    // CONFIGURACIÓN CLAVE: Cliente HTTP con tu Interceptor
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};