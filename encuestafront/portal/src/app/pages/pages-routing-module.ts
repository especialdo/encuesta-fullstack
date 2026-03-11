import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PagesComponent } from './pages.component';
import { CrearEncuestaComponent } from './crear-encuesta/crear-encuesta.component';
import { ResponderEncuestaComponent } from './responder-encuesta/responder-encuesta.component';
import { authGuard } from '../guard/auth.guard';
import { ResultadosComponent } from './resultados/resultados.component';

const routes: Routes = [
  {
    path: '',
    component: PagesComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: '' },
      },
      {
        path: 'crear',
        component: CrearEncuestaComponent,
        data: { title: '' },
      },
    ],
  },
  {
    path: 'encuesta/:id/responder',
    component: ResponderEncuestaComponent,
  },
  {
    path: 'encuesta/:id/resultados',
    canActivate: [authGuard],
    component: ResultadosComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}
