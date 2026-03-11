// ─── DTOs del backend ─────────────────────────────────────────────────────────
export interface RespuestaItemResponseDto {
  preguntaId: number;
  opcionId: number | null;
  respuestaTexto: string | null;
}

export interface RespuestaEncuestaResponseDto {
  id: number;
  nombreRespondente: string;
  fechaRespuesta?: string;
  respuestas: RespuestaItemResponseDto[];
}

// ─── Modelos para visualización ───────────────────────────────────────────────
export interface OpcionStats {
  opcionId: number;
  texto: string;
  cantidad: number;
  porcentaje: number;
}

export interface PreguntaStats {
  preguntaId: number;
  textoPregunta: string;
  tipo: string;
  totalRespuestas: number;
  opcionStats: OpcionStats[]; // para cerrada/multiple
  respuestasAbiertas: string[]; // para abierta
}

export interface ResultadosData {
  encuestaId: number;
  titulo: string;
  descripcion: string;
  totalRespondentes: number;
  preguntas: PreguntaStats[];
  respuestasRaw: RespuestaEncuestaResponseDto[];
}

// ─── Estado NgRx ──────────────────────────────────────────────────────────────
export interface ResultadosState {
  data: ResultadosData | null;
  loading: boolean;
  error: string | null;
}

export const initialResultadosState: ResultadosState = {
  data: null,
  loading: false,
  error: null,
};
