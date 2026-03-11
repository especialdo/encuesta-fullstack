import { EncuestaResponseDto } from '../dto/EncuestaDto';

export interface OpcionModel {
  id: number;
  texto: string;
}

export interface PreguntaModel {
  id: number;
  texto: string;
  tipo: 'abierta' | 'opcion_multiple' | 'unica';
  opciones: OpcionModel[];
}

export interface EncuestaModel {
  id: number;
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
  preguntas: PreguntaModel[];
}

// ─── Estado NgRx ──────────────────────────────────────────────────────────────

export interface EncuestasState {
  encuestas: EncuestaResponseDto[];
  encuestaActiva: EncuestaResponseDto | null;
  loading: boolean;
  loadingCrear: boolean;
  error: string | null;
}

export const initialEncuestasState: EncuestasState = {
  encuestas: [],
  encuestaActiva: null,
  loading: false,
  loadingCrear: false,
  error: null,
};
