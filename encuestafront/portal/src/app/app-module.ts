import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

import { NoPageFoundComponent } from './no-page-found/no-page-found.component';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { AuthEffects } from './Store/auth/effects/auth.effects';
import { authFeatureKey, authReducer } from './Store/auth/reducers/auth.reducer';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { EncuestasEffects } from './Store/encuesta/effects/encuesta.effects';
import { AuthInterceptor } from './guard/AuthInterceptor';
import { encuestasFeatureKey, encuestasReducer } from './Store/encuesta/reducers/encuesta.reducer';
import {
  resultadosFeatureKey,
  resultadosReducer,
} from './Store/encuesta/reducers/resultados.reducer';
import { ResultadosEffects } from './Store/encuesta/effects/resultados.effects';

@NgModule({
  declarations: [App, NoPageFoundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    StoreModule.forFeature(authFeatureKey, authReducer),
    StoreModule.forFeature(encuestasFeatureKey, encuestasReducer),

    EffectsModule.forFeature([AuthEffects, EncuestasEffects]),
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [App],
})
export class AppModule {}
