import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Observable, map, switchMap } from 'rxjs';

import {
  ENCUESTA_REPOSITORY_PORT,
  type EncuestaRepositoryPort,
} from '../../domain/ports/out/encuesta-repository.port';
import { Encuesta } from '../../domain/entities/encuesta.entity';
import {
  RespuestaEncuesta,
  RespuestaItem,
} from '../../domain/entities/respuesta-encuesta.entity';
import {
  CrearEncuestaDto,
  EncuestaResponseDto,
  ResponderEncuestaDto,
  RespuestaEncuestaResponseDto,
} from '../dtos/encuesta.dto';
import { EncuestaAssembler } from './encuesta.assembler';
import { type TokenPayload } from '../../../auth/domain/ports/out/token-payload.port';
import { Pregunta } from '@modules/encuesta/domain/entities/pregunta.entity';
import { Opcion } from '@modules/encuesta/domain/entities/opcion.entity';

// ── Crear encuesta ────────────────────────────────────────────────────────────
@Injectable()
export class CrearEncuestaUseCase {
  constructor(
    @Inject(ENCUESTA_REPOSITORY_PORT)
    private readonly repo: EncuestaRepositoryPort,
  ) {}

  execute(
    dto: CrearEncuestaDto,
    creador: TokenPayload,
  ): Observable<EncuestaResponseDto> {
    const encuesta = Encuesta.create({
      id: 0,
      titulo: dto.titulo,
      descripcion: dto.descripcion,
      creadorId: creador.sub,
      preguntas: dto.preguntas.map((p) =>
        Pregunta.create({
          id: 0,
          texto: p.texto,
          tipo: p.tipo,
          opciones: (p.opciones ?? []).map((o) =>
            Opcion.create({ id: 0, texto: o.texto }),
          ),
        }),
      ),
    });
    return this.repo.save(encuesta).pipe(map(EncuestaAssembler.toResponse));
  }
}

// ── Obtener encuesta pública ──────────────────────────────────────────────────
@Injectable()
export class ObtenerEncuestaUseCase {
  constructor(
    @Inject(ENCUESTA_REPOSITORY_PORT)
    private readonly repo: EncuestaRepositoryPort,
  ) {}

  execute(id: number): Observable<EncuestaResponseDto> {
    return this.repo.findById(id).pipe(
      map((encuesta) => {
        if (!encuesta)
          throw new NotFoundException(`Encuesta ${id} no encontrada`);
        return EncuestaAssembler.toResponse(encuesta);
      }),
    );
  }
}

// ── Listar encuestas del creador ──────────────────────────────────────────────
@Injectable()
export class ListarEncuestasUseCase {
  constructor(
    @Inject(ENCUESTA_REPOSITORY_PORT)
    private readonly repo: EncuestaRepositoryPort,
  ) {}

  execute(creador: TokenPayload): Observable<EncuestaResponseDto[]> {
    return this.repo
      .findAll(creador.sub)
      .pipe(map((encuestas) => encuestas.map(EncuestaAssembler.toResponse)));
  }
}

// ── Eliminar encuesta ─────────────────────────────────────────────────────────
@Injectable()
export class EliminarEncuestaUseCase {
  constructor(
    @Inject(ENCUESTA_REPOSITORY_PORT)
    private readonly repo: EncuestaRepositoryPort,
  ) {}

  execute(id: number, creador: TokenPayload): Observable<void> {
    return this.repo.findById(id).pipe(
      map((encuesta) => {
        if (!encuesta)
          throw new NotFoundException(`Encuesta ${id} no encontrada`);
        if (encuesta.creadorId !== creador.sub) {
          throw new NotFoundException(`Encuesta ${id} no encontrada`);
        }
        return encuesta;
      }),
      switchMap(() => this.repo.delete(id)),
    );
  }
}

// ── Responder encuesta (público) ──────────────────────────────────────────────
@Injectable()
export class ResponderEncuestaUseCase {
  constructor(
    @Inject(ENCUESTA_REPOSITORY_PORT)
    private readonly repo: EncuestaRepositoryPort,
  ) {}

  execute(
    encuestaId: number,
    dto: ResponderEncuestaDto,
  ): Observable<RespuestaEncuestaResponseDto> {
    return this.repo.findById(encuestaId).pipe(
      switchMap((encuesta) => {
        if (!encuesta)
          throw new NotFoundException(`Encuesta ${encuestaId} no encontrada`);

        const respuesta = RespuestaEncuesta.create({
          id: 0,
          encuestaId,
          nombreRespondente: dto.nombreRespondente,
          respuestas: dto.respuestas.map(
            (r) =>
              new RespuestaItem(
                r.preguntaId,
                r.opcionId ?? null,
                r.respuestaTexto ?? null,
              ),
          ),
        });

        return this.repo.saveRespuesta(respuesta);
      }),
      map(EncuestaAssembler.toRespuestaResponse),
    );
  }
}

// ── Ver respuestas de una encuesta ────────────────────────────────────────────
@Injectable()
export class VerRespuestasUseCase {
  constructor(
    @Inject(ENCUESTA_REPOSITORY_PORT)
    private readonly repo: EncuestaRepositoryPort,
  ) {}

  execute(encuestaId: number): Observable<RespuestaEncuestaResponseDto[]> {
    return this.repo
      .findRespuestasByEncuestaId(encuestaId)
      .pipe(
        map((respuestas) =>
          respuestas.map(EncuestaAssembler.toRespuestaResponse),
        ),
      );
  }
}
