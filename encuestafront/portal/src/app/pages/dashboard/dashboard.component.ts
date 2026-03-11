import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject, takeUntil } from 'rxjs';
import { SessionActions } from '../../Store/auth/actions/auth.actions';
import { EncuestasActions } from '../../Store/encuesta/actions/encuesta.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  selectEncuestas,
  selectTotalEncuestas,
} from '../../Store/encuesta/selector/encuesta.selector';
import { selectError, selectLoading, selectUser } from '../../Store/auth/selector/auth.selector';
import { EncuestaResponseDto } from '../../dto/EncuestaDto';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private snack = inject(MatSnackBar);
  private destroy$ = new Subject<void>();

  encuestas$ = this.store.select(selectEncuestas);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);
  total$ = this.store.select(selectTotalEncuestas);
  user$ = this.store.select(selectUser);

  confirmDeleteId: number | null = null;

  ngOnInit(): void {
    this.store.dispatch(EncuestasActions.loadMisEncuestas());

    this.error$.pipe(takeUntil(this.destroy$)).subscribe((err) => {
      if (err) {
        this.snack.open(err, 'Cerrar', { duration: 4000, panelClass: 'snack-error' });
        this.store.dispatch(EncuestasActions.clearError());
      }
    });
  }

  confirmarEliminar(id: number): void {
    this.confirmDeleteId = id;
  }

  cancelarEliminar(): void {
    this.confirmDeleteId = null;
  }

  eliminar(id: number): void {
    this.store.dispatch(EncuestasActions.eliminarEncuesta({ id }));
    this.confirmDeleteId = null;
  }

  logout(): void {
    this.store.dispatch(SessionActions.logout());
  }

  copiarEnlace(id: number): void {
    const url = `${window.location.origin}/panel/encuesta/${id}/responder`;
    navigator.clipboard.writeText(url);
    this.snack.open('Enlace copiado al portapapeles', 'OK', { duration: 2000 });
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  trackById(_: number, item: EncuestaResponseDto): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
