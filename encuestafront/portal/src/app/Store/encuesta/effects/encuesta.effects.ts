import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, exhaustMap, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { EncuestasService } from '../../../services/encuesta';
import { EncuestasActions } from '../actions/encuesta.actions';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class EncuestasEffects {
  private actions$ = inject(Actions);
  private encuestasService = inject(EncuestasService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);

  // ─── Load Mis Encuestas ───────────────────────────────────────────────────
  loadMisEncuestas$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EncuestasActions.loadMisEncuestas),
      switchMap(() =>
        this.encuestasService.getMisEncuestas().pipe(
          map((encuestas) => EncuestasActions.loadMisEncuestasSuccess({ encuestas })),
          catchError((err) => {
            const msg = err?.error?.message ?? err?.message ?? 'Error al cargar encuestas';
            this.snack.open(msg, 'Cerrar', { duration: 4000 });
            return of(EncuestasActions.loadMisEncuestasFailure({ error: msg }));
          }),
        ),
      ),
    ),
  );

  // ─── Load Encuesta Pública ────────────────────────────────────────────────
  loadEncuestaPublica$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EncuestasActions.loadEncuestaPublica),
      switchMap(({ id }) =>
        this.encuestasService.getEncuestaPublica(id).pipe(
          map((encuesta) => EncuestasActions.loadEncuestaPublicaSuccess({ encuesta })),
          catchError((err) =>
            of(
              EncuestasActions.loadEncuestaPublicaFailure({
                error: err?.error?.message ?? 'Encuesta no encontrada',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // ─── Crear Encuesta ───────────────────────────────────────────────────────
  crearEncuesta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EncuestasActions.crearEncuesta),
      tap(() => {
        this.snack.open('Encuesta creada exitosamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/panel/dashboard']);
      }),
      exhaustMap(({ dto }) =>
        this.encuestasService.crearEncuesta(dto).pipe(
          map((encuesta) => EncuestasActions.crearEncuestaSuccess({ encuesta })),
          catchError((err) =>
            of(
              EncuestasActions.crearEncuestaFailure({
                error: err?.error?.message ?? 'Error al crear la encuesta',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  crearEncuestaSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EncuestasActions.crearEncuestaSuccess),
        tap(() => this.router.navigate(['/panel/dashboard'])),
      ),
    { dispatch: false },
  );

  // ─── Responder Encuesta ───────────────────────────────────────────────────
  responderEncuesta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EncuestasActions.responderEncuesta),
      exhaustMap(({ id, dto }) =>
        this.encuestasService.responderEncuesta(id, dto).pipe(
          map(() => EncuestasActions.responderEncuestaSuccess()),
          catchError((err) =>
            of(
              EncuestasActions.responderEncuestaFailure({
                error: err?.error?.message ?? 'Error al enviar respuestas',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // ─── Eliminar ─────────────────────────────────────────────────────────────
  eliminarEncuesta$ = createEffect(() =>
    this.actions$.pipe(
      ofType(EncuestasActions.eliminarEncuesta), // ← solo este
      exhaustMap(({ id }) =>
        this.encuestasService.eliminarEncuesta(id).pipe(
          map(() => EncuestasActions.eliminarEncuestaSuccess({ id })),
          catchError((err) =>
            of(
              EncuestasActions.eliminarEncuestaFailure({
                error: err?.error?.message ?? 'Error al eliminar la encuesta',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // ─── Eliminar success — snack separado ────────────────────────────────────
  eliminarEncuestaSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(EncuestasActions.eliminarEncuestaSuccess),
        tap(() => this.snack.open('Encuesta eliminada', 'Cerrar', { duration: 2500 })),
      ),
    { dispatch: false },
  );
}
