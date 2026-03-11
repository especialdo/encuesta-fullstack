import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, Observable, map } from 'rxjs';

import type { EncuestaRepositoryPort } from '../../domain/ports/out/encuesta-repository.port';
import { Encuesta } from '../../domain/entities/encuesta.entity';
import { RespuestaEncuesta } from '../../domain/entities/respuesta-encuesta.entity';

import { EncuestaMapper } from '../mappers/encuesta.mapper';
import { RespuestaEncuestaOrmEntity } from '../entities-orm/respuesta-encuesta-orm.entity';
import { RespuestaOrmEntity } from '../entities-orm/respuesta-orm.entity';
import { EncuestaOrmEntity } from '../entities-orm/encuesta-orm.entity';
import { PreguntaOrmEntity } from '../entities-orm/pregunta-orm.entity';
import { OpcionOrmEntity } from '../entities-orm/opcion-orm.entity';

@Injectable()
export class EncuestaTypeOrmRepository implements EncuestaRepositoryPort {
  constructor(
    @InjectRepository(EncuestaOrmEntity)
    private readonly encuestaRepo: Repository<EncuestaOrmEntity>,
    @InjectRepository(RespuestaEncuestaOrmEntity)
    private readonly respuestaRepo: Repository<RespuestaEncuestaOrmEntity>,
    private readonly mapper: EncuestaMapper,
  ) {}

  save(encuesta: Encuesta): Observable<Encuesta> {
    const orm = new EncuestaOrmEntity();
    orm.titulo = encuesta.titulo;
    orm.descripcion = encuesta.descripcion;
    orm.creadorId = encuesta.creadorId;
    orm.preguntas = encuesta.preguntas.map((p) => {
      const pOrm = new PreguntaOrmEntity();
      pOrm.texto = p.texto;
      pOrm.tipo = p.tipo;
      pOrm.opciones = p.opciones.map((o) => {
        const oOrm = new OpcionOrmEntity();
        oOrm.texto = o.texto;
        return oOrm;
      });
      return pOrm;
    });

    return from(this.encuestaRepo.save(orm)).pipe(
      map((saved) => this.mapper.toDomain(saved)),
    );
  }

  findById(id: number): Observable<Encuesta | null> {
    return from(
      this.encuestaRepo.findOne({
        where: { id },
        relations: ['preguntas', 'preguntas.opciones'],
      }),
    ).pipe(map((o) => (o ? this.mapper.toDomain(o) : null)));
  }

  findAll(creadorId: string): Observable<Encuesta[]> {
    return from(
      this.encuestaRepo.find({
        where: { creadorId },
        relations: ['preguntas', 'preguntas.opciones'],
        order: { fechaCreacion: 'DESC' },
      }),
    ).pipe(map((orms) => orms.map((o) => this.mapper.toDomain(o))));
  }

  delete(id: number): Observable<void> {
    return from(this.encuestaRepo.delete(id)).pipe(map(() => undefined));
  }

  saveRespuesta(respuesta: RespuestaEncuesta): Observable<RespuestaEncuesta> {
    const orm = new RespuestaEncuestaOrmEntity();
    orm.encuestaId = respuesta.encuestaId;
    orm.nombreRespondente = respuesta.nombreRespondente;
    orm.respuestas = respuesta.respuestas.map((r) => {
      const rOrm = new RespuestaOrmEntity();
      rOrm.preguntaId = r.preguntaId;
      rOrm.opcionId = r.opcionId ?? null;
      rOrm.respuestaTexto = r.respuestaTexto ?? null;
      return rOrm;
    });

    return from(this.respuestaRepo.save(orm)).pipe(
      map((saved) => this.mapper.respuestaToDomain(saved)),
    );
  }

  findRespuestasByEncuestaId(
    encuestaId: number,
  ): Observable<RespuestaEncuesta[]> {
    return from(
      this.respuestaRepo.find({
        where: { encuestaId },
        relations: ['respuestas'],
        order: { fechaRespuesta: 'DESC' },
      }),
    ).pipe(map((orms) => orms.map((o) => this.mapper.respuestaToDomain(o))));
  }
}
