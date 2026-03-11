import { createFeature, createReducer, on } from '@ngrx/store';
import { EncuestasActions } from '../actions/encuesta.actions';
import { initialEncuestasState } from '../../../model/Encuesta.Model';

export const encuestasFeatureKey = 'encuestas';

export const encuestasReducer = createReducer(
  initialEncuestasState,

  // ─── Load Mis Encuestas ───────────────────────────────────────────────────
  on(EncuestasActions.loadMisEncuestas, (state) => ({ ...state, loading: true, error: null })),
  on(EncuestasActions.loadMisEncuestasSuccess, (state, { encuestas }) => ({
    ...state,
    encuestas,
    loading: false,
  })),
  on(EncuestasActions.loadMisEncuestasFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ─── Load Encuesta Pública ────────────────────────────────────────────────
  on(EncuestasActions.loadEncuestaPublica, (state) => ({ ...state, loading: true, error: null })),
  on(EncuestasActions.loadEncuestaPublicaSuccess, (state, { encuesta }) => ({
    ...state,
    encuestaActiva: encuesta,
    loading: false,
  })),
  on(EncuestasActions.loadEncuestaPublicaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ─── Crear Encuesta ───────────────────────────────────────────────────────
  on(EncuestasActions.crearEncuesta, (state) => ({ ...state, loadingCrear: true, error: null })),
  on(EncuestasActions.crearEncuestaSuccess, (state, { encuesta }) => ({
    ...state,
    encuestas: [encuesta, ...state.encuestas],
    loadingCrear: false,
  })),
  on(EncuestasActions.crearEncuestaFailure, (state, { error }) => ({
    ...state,
    loadingCrear: false,
    error,
  })),

  // ─── Responder Encuesta ───────────────────────────────────────────────────
  on(EncuestasActions.responderEncuesta, (state) => ({ ...state, loading: true, error: null })),
  on(EncuestasActions.responderEncuestaSuccess, (state) => ({
    ...state,
    loading: false,
  })),
  on(EncuestasActions.responderEncuestaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ─── Eliminar Encuesta ────────────────────────────────────────────────────
  on(EncuestasActions.eliminarEncuesta, (state) => ({ ...state, loading: true, error: null })),
  on(EncuestasActions.eliminarEncuestaSuccess, (state, { id }) => ({
    ...state,
    encuestas: state.encuestas.filter((e) => e.id !== id),
    loading: false,
  })),
  on(EncuestasActions.eliminarEncuestaFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ─── Clear ────────────────────────────────────────────────────────────────
  on(EncuestasActions.clearSuccess, (state) => ({ ...state, success: null })),
  on(EncuestasActions.clearError, (state) => ({ ...state, error: null })),
);

export const encuestasFeature = createFeature({
  name: encuestasFeatureKey,
  reducer: encuestasReducer,
});
