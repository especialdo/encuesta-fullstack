import { Injectable } from '@nestjs/common';
import { Encuesta } from '../../domain/entities/encuesta.entity';
import { Pregunta } from '../../domain/entities/pregunta.entity';
import { Opcion } from '../../domain/entities/opcion.entity';
import {
  RespuestaEncuesta,
  RespuestaItem,
} from '../../domain/entities/respuesta-encuesta.entity';
import { TipoPregunta } from '../../domain/value-objects/tipo-pregunta.vo';
import { RespuestaEncuestaOrmEntity } from '../entities-orm/respuesta-encuesta-orm.entity';
import { EncuestaOrmEntity } from '../entities-orm/encuesta-orm.entity';

@Injectable()
export class EncuestaMapper {
  toDomain(orm: EncuestaOrmEntity): Encuesta {
    return Encuesta.create({
      id: orm.id,
      titulo: orm.titulo,
      descripcion: orm.descripcion,
      creadorId: orm.creadorId,
      fechaCreacion: orm.fechaCreacion,
      preguntas: (orm.preguntas ?? []).map((p) =>
        Pregunta.create({
          id: p.id,
          texto: p.texto,
          tipo: p.tipo as TipoPregunta,
          opciones: (p.opciones ?? []).map((o) =>
            Opcion.create({ id: o.id, texto: o.texto }),
          ),
        }),
      ),
    });
  }

  respuestaToDomain(orm: RespuestaEncuestaOrmEntity): RespuestaEncuesta {
    return RespuestaEncuesta.create({
      id: orm.id,
      encuestaId: orm.encuestaId,
      nombreRespondente: orm.nombreRespondente,
      fechaRespuesta: orm.fechaRespuesta,
      respuestas: (orm.respuestas ?? []).map(
        (r) =>
          new RespuestaItem(
            r.preguntaId,
            r.opcionId ?? null,
            r.respuestaTexto ?? null,
          ),
      ),
    });
  }
}
