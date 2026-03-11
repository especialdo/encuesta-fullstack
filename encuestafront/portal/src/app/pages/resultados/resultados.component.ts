import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { selectData } from '../../Store/encuesta/selector/resultados.selector';
import { selectError, selectLoading } from '../../Store/auth/selector/auth.selector';
import { ResultadosActions } from '../../Store/encuesta/actions/resultados.actions';
import { PreguntaStats } from '../../model/Resultados.Model';
import { EncuestaWsService, NuevaRespuestaEvent } from '../../services/EncuestaWS';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-resultados',
  standalone: false,
  templateUrl: './resultados.component.html',
  styleUrl: './resultados.component.scss',
})
export class ResultadosComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private destroy$ = new Subject<void>();
  private wsService = inject(EncuestaWsService);
  private snack = inject(MatSnackBar);

  data$ = this.store.select(selectData);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  // Tabla
  displayedColumns = ['respondente', 'fecha', 'respuestas'];
  tablaExpandida: number | null = null;

  // Tabs
  tabActivo: 'graficas' | 'tabla' = 'graficas';
  encuestaId!: number;
  ultimaRespuesta: NuevaRespuestaEvent | null = null;
  mostrarNotificacion = false;

  ngOnInit(): void {
    this.encuestaId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(ResultadosActions.loadResultados({ id: this.encuestaId }));

    // ─── WebSocket ──────────────────────────────────────────────────────────
    this.wsService.connect();
    this.wsService.joinEncuesta(this.encuestaId);

    this.wsService
      .onNuevaRespuesta()
      .pipe(takeUntil(this.destroy$))
      .subscribe((event) => {
        if (event.encuestaId === this.encuestaId) {
          this.ultimaRespuesta = event;
          this.mostrarNotificacion = true;

          // Recargar datos automáticamente
          this.store.dispatch(ResultadosActions.loadResultados({ id: this.encuestaId }));

          // Mostrar snack
          this.snack.open(`Nueva respuesta de ${event.nombreRespondente}`, 'Ver', {
            duration: 4000,
            panelClass: 'snack-success',
          });

          // Ocultar badge después de 5 segundos
          setTimeout(() => (this.mostrarNotificacion = false), 5000);
        }
      });
  }

  recargarManual(): void {
    this.store.dispatch(ResultadosActions.loadResultados({ id: this.encuestaId }));
    this.mostrarNotificacion = false;
  }

  getBarWidth(porcentaje: number): string {
    return `${porcentaje}%`;
  }

  getColorByIndex(index: number): string {
    const colors = ['#1565C0', '#00ACC1', '#43A047', '#FB8C00', '#8E24AA', '#E53935'];
    return colors[index % colors.length];
  }

  toggleTabla(id: number): void {
    this.tablaExpandida = this.tablaExpandida === id ? null : id;
  }

  esConOpciones(tipo: string): boolean {
    return tipo === 'cerrada' || tipo === 'multiple';
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getPreguntaTexto(preguntas: PreguntaStats[], preguntaId: number): string {
    return (
      preguntas.find((p) => p.preguntaId === preguntaId)?.textoPregunta ?? `Pregunta ${preguntaId}`
    );
  }

  getOpcionTexto(preguntas: PreguntaStats[], preguntaId: number, opcionId: number): string {
    const pregunta = preguntas.find((p) => p.preguntaId === preguntaId);
    return (
      pregunta?.opcionStats.find((o) => o.opcionId === opcionId)?.texto ?? `Opción ${opcionId}`
    );
  }

  trackById(_: number, item: any): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.wsService.leaveEncuesta(this.encuestaId);
    this.wsService.disconnect();
    this.store.dispatch(ResultadosActions.clearResultados());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
