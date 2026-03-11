import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EncuestaController } from './infrastructure/api/controller/encuesta.controller';
import { EncuestaTypeOrmRepository } from './infrastructure/repositories/encuesta-typeorm.repository';
import { EncuestaMapper } from './infrastructure/mappers/encuesta.mapper';
import {
  CrearEncuestaUseCase,
  ObtenerEncuestaUseCase,
  ListarEncuestasUseCase,
  EliminarEncuestaUseCase,
  ResponderEncuestaUseCase,
  VerRespuestasUseCase,
} from './application/use-cases/encuesta.use-cases';
import { ENCUESTA_REPOSITORY_PORT } from './domain/ports/out/encuesta-repository.port';
import { EncuestaOrmEntity } from './infrastructure/entities-orm/encuesta-orm.entity';
import { PreguntaOrmEntity } from './infrastructure/entities-orm/pregunta-orm.entity';
import { OpcionOrmEntity } from './infrastructure/entities-orm/opcion-orm.entity';
import { RespuestaEncuestaOrmEntity } from './infrastructure/entities-orm/respuesta-encuesta-orm.entity';
import { RespuestaOrmEntity } from './infrastructure/entities-orm/respuesta-orm.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EncuestaOrmEntity,
      PreguntaOrmEntity,
      OpcionOrmEntity,
      RespuestaEncuestaOrmEntity,
      RespuestaOrmEntity,
    ]),
  ],
  controllers: [EncuestaController],
  providers: [
    EncuestaMapper,
    { provide: ENCUESTA_REPOSITORY_PORT, useClass: EncuestaTypeOrmRepository },
    CrearEncuestaUseCase,
    ObtenerEncuestaUseCase,
    ListarEncuestasUseCase,
    EliminarEncuestaUseCase,
    ResponderEncuestaUseCase,
    VerRespuestasUseCase,
  ],
})
export class EncuestaModule {}
