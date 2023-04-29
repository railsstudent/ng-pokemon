import { provideHttpClient } from '@angular/common/http';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { PreloadAllModules, Route, provideRouter, withDebugTracing, withPreloading } from '@angular/router';

const APP_ROUTES: Route[] = [];

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTES, withPreloading(PreloadAllModules), withDebugTracing()),
  ]
}).catch(err => console.error(err));