import { createSelector } from '@ngrx/store';
import { encuestasFeature } from '../reducers/encuesta.reducer';

export const {
  selectEncuestasState,
  selectEncuestas,
  selectEncuestaActiva,
  selectLoading,
  selectLoadingCrear,
  selectError,
} = encuestasFeature;

export const selectTotalEncuestas = createSelector(
  selectEncuestas,
  (encuestas) => encuestas.length,
);

export const selectEncuestaById = (id: number) =>
  createSelector(selectEncuestas, (encuestas) => encuestas.find((e) => e.id === id) ?? null);
