import { Observable } from 'rxjs';
import { Encuesta } from '../../entities/encuesta.entity';
import { RespuestaEncuesta } from '../../entities/respuesta-encuesta.entity';

export const ENCUESTA_REPOSITORY_PORT = Symbol('ENCUESTA_REPOSITORY_PORT');

export interface EncuestaRepositoryPort {
  save(encuesta: Encuesta): Observable<Encuesta>;
  findById(id: number): Observable<Encuesta | null>;
  findAll(creadorId: string): Observable<Encuesta[]>;
  delete(id: number): Observable<void>;
  saveRespuesta(respuesta: RespuestaEncuesta): Observable<RespuestaEncuesta>;
  findRespuestasByEncuestaId(
    encuestaId: number,
  ): Observable<RespuestaEncuesta[]>;
}
