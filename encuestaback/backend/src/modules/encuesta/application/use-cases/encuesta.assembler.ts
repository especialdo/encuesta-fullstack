import { Encuesta } from '../../domain/entities/encuesta.entity';
import { RespuestaEncuesta } from '../../domain/entities/respuesta-encuesta.entity';
import {
  EncuestaResponseDto,
  RespuestaEncuestaResponseDto,
} from '../dtos/encuesta.dto';

export class EncuestaAssembler {
  static toResponse(e: Encuesta): EncuestaResponseDto {
    return {
      id: e.id,
      titulo: e.titulo,
      descripcion: e.descripcion,
      fechaCreacion: e.fechaCreacion,
      preguntas: e.preguntas.map((p) => ({
        id: p.id,
        texto: p.texto,
        tipo: p.tipo,
        opciones: p.opciones.map((o) => ({ id: o.id, texto: o.texto })),
      })),
    };
  }

  static toRespuestaResponse(
    r: RespuestaEncuesta,
  ): RespuestaEncuestaResponseDto {
    return {
      id: r.id,
      nombreRespondente: r.nombreRespondente,
      fechaRespuesta: r.fechaRespuesta,
      encuestaId: r.encuestaId,
    };
  }
}
