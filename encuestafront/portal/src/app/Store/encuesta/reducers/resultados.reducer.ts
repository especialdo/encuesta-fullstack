import { createFeature, createReducer, on } from '@ngrx/store';
import { ResultadosActions } from '../actions/resultados.actions';
import { initialResultadosState } from '../../../model/Resultados.Model';

export const resultadosFeatureKey = 'resultados';

export const resultadosReducer = createReducer(
  initialResultadosState,
  on(ResultadosActions.loadResultados, (state) => ({ ...state, loading: true, error: null })),
  on(ResultadosActions.loadResultadosSuccess, (state, { data }) => ({
    ...state,
    data,
    loading: false,
  })),
  on(ResultadosActions.loadResultadosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(ResultadosActions.clearResultados, (state) => ({ ...state, data: null })),
);

export const resultadosFeature = createFeature({
  name: resultadosFeatureKey,
  reducer: resultadosReducer,
});
