import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TipoPregunta } from '../../domain/value-objects/tipo-pregunta.vo';

// ── Crear encuesta ────────────────────────────────────────────────────────────

export class CrearOpcionDto {
  @ApiProperty() @IsString() @IsNotEmpty() texto: string;
}

export class CrearPreguntaDto {
  @ApiProperty() @IsString() @IsNotEmpty() texto: string;

  @ApiProperty({ enum: TipoPregunta })
  @IsEnum(TipoPregunta)
  tipo: TipoPregunta;

  @ApiPropertyOptional({ type: [CrearOpcionDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearOpcionDto)
  opciones?: CrearOpcionDto[];
}

export class CrearEncuestaDto {
  @ApiProperty() @IsString() @IsNotEmpty() titulo: string;
  @ApiProperty() @IsString() @IsNotEmpty() descripcion: string;

  @ApiProperty({ type: [CrearPreguntaDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearPreguntaDto)
  preguntas: CrearPreguntaDto[];
}

// ── Responder encuesta (público) ──────────────────────────────────────────────

export class RespuestaItemDto {
  @ApiProperty() @IsNumber() preguntaId: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() opcionId?: number;
  @ApiPropertyOptional() @IsOptional() @IsString() respuestaTexto?: string;
}

export class ResponderEncuestaDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  nombreRespondente: string;

  @ApiProperty({ type: [RespuestaItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RespuestaItemDto)
  respuestas: RespuestaItemDto[];
}

// ── Responses ─────────────────────────────────────────────────────────────────

export class OpcionResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() texto: string;
}

export class PreguntaResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() texto: string;
  @ApiProperty({ enum: TipoPregunta }) tipo: TipoPregunta;
  @ApiProperty({ type: [OpcionResponseDto] }) opciones: OpcionResponseDto[];
}

export class EncuestaResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() titulo: string;
  @ApiProperty() descripcion: string;
  @ApiProperty() fechaCreacion: Date;
  @ApiProperty({ type: [PreguntaResponseDto] })
  preguntas: PreguntaResponseDto[];
}

export class RespuestaItemResponseDto {
  @ApiProperty() preguntaId: number;
  @ApiPropertyOptional() opcionId?: number | null;
  @ApiPropertyOptional() respuestaTexto?: string | null;
}
export class RespuestaEncuestaResponseDto {
  @ApiProperty() id: number;
  @ApiProperty() nombreRespondente: string;
  @ApiProperty() fechaRespuesta: Date;
  @ApiProperty() encuestaId: number;
  @ApiProperty({ type: [RespuestaItemResponseDto] })
  respuestas: RespuestaItemResponseDto[];
}
