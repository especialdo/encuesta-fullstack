import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { ResultadosData } from '../../../model/Resultados.Model';

export const ResultadosActions = createActionGroup({
  source: 'Resultados',
  events: {
    'Load Resultados': props<{ id: number }>(),
    'Load Resultados Success': props<{ data: ResultadosData }>(),
    'Load Resultados Failure': props<{ error: string }>(),
    'Clear Resultados': emptyProps(),
  },
});
