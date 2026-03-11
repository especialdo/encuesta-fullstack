import { Injectable, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

export interface NuevaRespuestaEvent {
  encuestaId: number;
  nombreRespondente: string;
  fechaRespuesta: Date;
  totalRespuestas: number;
}

@Injectable({ providedIn: 'root' })
export class EncuestaWsService implements OnDestroy {
  private socket: Socket | null = null;
  private readonly WS_URL = 'http://localhost:3000/encuestas';

  private nuevaRespuesta$ = new Subject<NuevaRespuestaEvent>();

  // ─── Conectar al namespace ────────────────────────────────────────────────
  connect(): void {
    if (this.socket?.connected) return;

    this.socket = io(this.WS_URL, {
      transports: ['websocket'],
      withCredentials: true,
      autoConnect: true,
    });

    this.socket.on('connect', () => {
      console.log('[WS] Conectado:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('[WS] Desconectado');
    });

    this.socket.on('nueva-respuesta', (data: NuevaRespuestaEvent) => {
      console.log('[WS] Nueva respuesta recibida:', data);
      this.nuevaRespuesta$.next(data);
    });
  }

  // ─── Unirse a sala de una encuesta ────────────────────────────────────────
  joinEncuesta(encuestaId: number): void {
    this.socket?.emit('join-encuesta', { encuestaId });
  }

  // ─── Salir de sala ────────────────────────────────────────────────────────
  leaveEncuesta(encuestaId: number): void {
    this.socket?.emit('leave-encuesta', { encuestaId });
  }

  // ─── Observable de nuevas respuestas ─────────────────────────────────────
  onNuevaRespuesta(): Observable<NuevaRespuestaEvent> {
    return this.nuevaRespuesta$.asObservable();
  }

  // ─── Desconectar ──────────────────────────────────────────────────────────
  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
