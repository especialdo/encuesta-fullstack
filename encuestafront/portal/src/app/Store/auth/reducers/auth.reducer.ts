import { createFeature, createReducer, on } from '@ngrx/store';
import { LoginActions, RegisterActions, SessionActions } from '../actions/auth.actions';
import { AuthState, initialAuthState } from '../../../model/User';

export const authFeatureKey = 'auth';

const initialState: AuthState = initialAuthState;

export const authReducer = createReducer(
  initialState,

  // ─── Login ────────────────────────────────────────────────────────────────
  on(LoginActions.login, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(LoginActions.loginSuccess, (state, { token }) => ({
    ...state,
    token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),
  on(LoginActions.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ─── Register ─────────────────────────────────────────────────────────────
  on(RegisterActions.register, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(RegisterActions.registerSuccess, (state, { token }) => ({
    ...state,
    token,
    isAuthenticated: true,
    loading: false,
    error: null,
  })),
  on(RegisterActions.registerFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ─── Session ──────────────────────────────────────────────────────────────
  on(SessionActions.logout, () => initialAuthState),
  on(SessionActions.restoreToken, (state, { token }) => ({
    ...state,
    token,
    isAuthenticated: true,
  })),
);

export const authFeature = createFeature({
  name: authFeatureKey,
  reducer: authReducer,
});
