import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import { ResultadosActions } from '../actions/resultados.actions';
import { ResultadosService } from '../../../services/resultados';

@Injectable()
export class ResultadosEffects {
  private actions$ = inject(Actions);
  private resultadosService = inject(ResultadosService);

  loadResultados$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ResultadosActions.loadResultados),
      tap(({ id }) => console.log('Effect disparado con id:', id)), // ← agrega
      switchMap(({ id }) =>
        this.resultadosService.getResultados(id).pipe(
          tap((data) => console.log('Data del service:', data)), // ← agrega
          map((data) => ResultadosActions.loadResultadosSuccess({ data })),
          catchError((err) => {
            console.log('Error en effect:', err); // ← agrega
            return of(
              ResultadosActions.loadResultadosFailure({
                error: err?.error?.message ?? 'Error al cargar resultados',
              }),
            );
          }),
        ),
      ),
    ),
  );
}
