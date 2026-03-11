import { createSelector } from '@ngrx/store';
import { authFeature } from '../reducers/auth.reducer';

export const { selectAuthState, selectToken, selectIsAuthenticated, selectLoading, selectError } =
  authFeature;

export const selectUser = createSelector(selectAuthState, (state) => state.user);

export const selectIsLoading = createSelector(selectLoading, (loading) => loading);
