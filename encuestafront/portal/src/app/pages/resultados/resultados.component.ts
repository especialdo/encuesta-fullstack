import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { selectData } from '../../Store/encuesta/selector/resultados.selector';
import { selectError, selectLoading } from '../../Store/auth/selector/auth.selector';
import { ResultadosActions } from '../../Store/encuesta/actions/resultados.actions';
import { PreguntaStats } from '../../model/Resultados.Model';

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

  data$ = this.store.select(selectData);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  // Tabla
  displayedColumns = ['respondente', 'fecha', 'respuestas'];
  tablaExpandida: number | null = null;

  // Tabs
  tabActivo: 'graficas' | 'tabla' = 'graficas';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(ResultadosActions.loadResultados({ id }));

    this.data$.subscribe((data) => console.log('Data en store:', data));
    this.loading$.subscribe((l) => console.log('Loading:', l));
    this.error$.subscribe((e) => console.log('Error:', e));
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
  trackByIndex(i: number): number {
    return i;
  }

  ngOnDestroy(): void {
    this.store.dispatch(ResultadosActions.clearResultados());
    this.destroy$.next();
    this.destroy$.complete();
  }
}
