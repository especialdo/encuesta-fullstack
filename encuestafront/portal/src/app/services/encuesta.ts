import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CrearEncuestaRequestDto,
  EncuestaResponseDto,
  ResponderEncuestaRequestDto,
} from '../dto/EncuestaDto';
@Injectable({ providedIn: 'root' })
export class EncuestasService {
  private readonly BASE_URL = 'http://localhost:3000/api/encuestas';

  constructor(private http: HttpClient) {}

  getMisEncuestas(): Observable<EncuestaResponseDto[]> {
    return this.http.get<EncuestaResponseDto[]>(`${this.BASE_URL}/mis-encuestas`);
  }

  getEncuestaPublica(id: number): Observable<EncuestaResponseDto> {
    return this.http.get<EncuestaResponseDto>(`${this.BASE_URL}/${id}/publica`);
  }

  crearEncuesta(dto: CrearEncuestaRequestDto): Observable<EncuestaResponseDto> {
    return this.http.post<EncuestaResponseDto>(this.BASE_URL, dto);
  }

  responderEncuesta(id: number, dto: ResponderEncuestaRequestDto): Observable<void> {
    return this.http.post<void>(`${this.BASE_URL}/${id}/responder`, dto);
  }

  eliminarEncuesta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASE_URL}/${id}`);
  }
}
