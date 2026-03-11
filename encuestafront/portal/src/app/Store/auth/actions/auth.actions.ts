import { createActionGroup, emptyProps, props } from '@ngrx/store';

// ─── Login Actions ────────────────────────────────────────────────────────────

export const LoginActions = createActionGroup({
  source: 'Auth/Login',
  events: {
    Login: props<{ email: string; password: string }>(),
    'Login Success': props<{ token: string }>(),
    'Login Failure': props<{ error: string }>(),
  },
});

// ─── Register Actions ─────────────────────────────────────────────────────────

export const RegisterActions = createActionGroup({
  source: 'Auth/Register',
  events: {
    Register: props<{ name: string; email: string; password: string }>(),
    'Register Success': props<{ token: string }>(),
    'Register Failure': props<{ error: string }>(),
  },
});

// ─── Session Actions ──────────────────────────────────────────────────────────

export const SessionActions = createActionGroup({
  source: 'Auth/Session',
  events: {
    Logout: emptyProps(),
    'Restore Token': props<{ token: string }>(),
  },
});
