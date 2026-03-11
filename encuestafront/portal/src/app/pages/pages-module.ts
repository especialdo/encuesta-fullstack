import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing-module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { ResponderEncuestaComponent } from './responder-encuesta/responder-encuesta.component';
import { CrearEncuestaComponent } from './crear-encuesta/crear-encuesta.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ResultadosComponent } from './resultados/resultados.component';
import { ResultadosEffects } from '../Store/encuesta/effects/resultados.effects';
import {
  resultadosFeatureKey,
  resultadosReducer,
} from '../Store/encuesta/reducers/resultados.reducer';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [
    DashboardComponent,
    PagesComponent,
    ResponderEncuestaComponent,
    CrearEncuestaComponent,
    ResultadosComponent,
  ],
  exports: [
    DashboardComponent,
    PagesComponent,
    ResponderEncuestaComponent,
    CrearEncuestaComponent,
    ResultadosComponent,
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    MatChipsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatInputModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,

    StoreModule.forFeature(resultadosFeatureKey, resultadosReducer),
    EffectsModule.forFeature([ResultadosEffects]),
  ],
})
export class PagesModule {}
