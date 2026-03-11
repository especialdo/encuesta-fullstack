import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, exhaustMap, tap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import { AuthService } from '../../../services/auth';
import { Router } from '@angular/router';
import { LoginActions, RegisterActions, SessionActions } from '../actions/auth.actions';
import { LoginRequestDto } from '../../../dto/LoginRequestDto';
import { RegisterRequestDto } from '../../../dto/RegisterRequestDto';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  // ─── Login ────────────────────────────────────────────────────────────────

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(LoginActions.login),
      exhaustMap(({ email, password }) =>
        this.authService.login(new LoginRequestDto(email, password)).pipe(
          map((res) => LoginActions.loginSuccess({ token: res.token })),
          catchError((err) =>
            of(
              LoginActions.loginFailure({
                error: err?.error?.message ?? 'Error al iniciar sesión',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(LoginActions.loginSuccess),
        tap(({ token }) => {
          this.authService.saveToken(token);
          this.router.navigate(['/panel/dashboard']);
        }),
      ),
    { dispatch: false },
  );

  // ─── Register ─────────────────────────────────────────────────────────────

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(RegisterActions.register),
      exhaustMap(({ name, email, password }) =>
        this.authService.register(new RegisterRequestDto(name, email, password)).pipe(
          map((res) => RegisterActions.registerSuccess({ token: res.token })),
          catchError((err) =>
            of(
              RegisterActions.registerFailure({
                error: err?.error?.message ?? 'Error al registrarse',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  registerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(RegisterActions.registerSuccess),
        tap(({ token }) => {
          this.authService.saveToken(token);
          this.router.navigate(['/dashboard']);
        }),
      ),
    { dispatch: false },
  );

  // ─── Logout ───────────────────────────────────────────────────────────────

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(SessionActions.logout),
        tap(() => {
          this.authService.removeToken();
          this.router.navigate(['/auth/login']);
        }),
      ),
    { dispatch: false },
  );
}
