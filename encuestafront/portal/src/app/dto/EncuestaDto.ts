// ─── Request DTOs ─────────────────────────────────────────────────────────────

export interface OpcionRequestDto {
  texto: string;
}

export interface PreguntaRequestDto {
  texto: string;
  tipo: 'abierta' | 'multiple' | 'cerrada';
  opciones: OpcionRequestDto[];
}

export interface CrearEncuestaRequestDto {
  titulo: string;
  descripcion: string;
  preguntas: PreguntaRequestDto[];
}

export interface RespuestaItemDto {
  preguntaId: number;
  opcionId?: number;
  respuestaTexto?: string;
}

export interface ResponderEncuestaRequestDto {
  nombreRespondente: string;
  respuestas: RespuestaItemDto[];
}

// ─── Response DTOs ────────────────────────────────────────────────────────────

export interface OpcionResponseDto {
  id: number;
  texto: string;
}

export interface PreguntaResponseDto {
  id: number;
  texto: string;
  tipo: 'abierta' | 'multiple' | 'cerrada';
  opciones: OpcionResponseDto[];
}

export interface EncuestaResponseDto {
  id: number;
  titulo: string;
  descripcion: string;
  fechaCreacion: string;
  preguntas: PreguntaResponseDto[];
}
