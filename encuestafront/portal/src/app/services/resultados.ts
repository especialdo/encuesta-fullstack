import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

import { EncuestaResponseDto } from '../dto/EncuestaDto';
import {
  RespuestaEncuestaResponseDto,
  ResultadosData,
  PreguntaStats,
  OpcionStats,
} from '../model/Resultados.Model';

@Injectable({ providedIn: 'root' })
export class ResultadosService {
  private readonly BASE_URL = 'http://localhost:3000/api/encuestas';

  constructor(private http: HttpClient) {}

  getResultados(id: number): Observable<ResultadosData> {
    return forkJoin({
      encuesta: this.http.get<EncuestaResponseDto>(`${this.BASE_URL}/${id}/publica`),
      respuestas: this.http.get<RespuestaEncuestaResponseDto[]>(
        `${this.BASE_URL}/${id}/respuestas`,
      ),
    }).pipe(map(({ encuesta, respuestas }) => this.buildResultados(encuesta, respuestas)));
  }

  private buildResultados(
    encuesta: EncuestaResponseDto,
    respuestas: RespuestaEncuestaResponseDto[],
  ): ResultadosData {
    const preguntas: PreguntaStats[] = encuesta.preguntas.map((pregunta) => {
      const respuestasDePregunta = respuestas.flatMap(
        (r) => (r.respuestas ?? []).filter((ri) => ri.preguntaId === pregunta.id), // ← agrega ?? []
      );

      const totalRespuestas = respuestasDePregunta.length;

      const respuestasAbiertas = respuestasDePregunta
        .map((r) => r.respuestaTexto)
        .filter((t): t is string => !!t && t.trim() !== '');

      const opcionStats: OpcionStats[] = (pregunta.opciones ?? []).map((opcion) => {
        // ← agrega ?? []
        const cantidad = respuestasDePregunta.filter((r) => r.opcionId === opcion.id).length;
        return {
          opcionId: opcion.id,
          texto: opcion.texto,
          cantidad,
          porcentaje: totalRespuestas > 0 ? Math.round((cantidad / totalRespuestas) * 100) : 0,
        };
      });
      // resultados.service.ts — en buildResultados
      console.log(
        'Opciones de pregunta:',
        pregunta.opciones.map((o) => o.id),
      );
      console.log(
        'OpcionIds en respuestas:',
        respuestasDePregunta.map((r) => r.opcionId),
      );
      return {
        preguntaId: pregunta.id,
        textoPregunta: pregunta.texto,
        tipo: pregunta.tipo,
        totalRespuestas,
        opcionStats,
        respuestasAbiertas,
      };
    });

    return {
      encuestaId: encuesta.id,
      titulo: encuesta.titulo,
      descripcion: encuesta.descripcion,
      totalRespondentes: respuestas.length,
      preguntas,
      respuestasRaw: respuestas,
    };
  }
}
