import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Update } from '@ngrx/entity';

import { Gestion } from '../models/gestion.model';

export const GestionActions = createActionGroup({
  source: 'Gestion/API',
  events: {
    'Load Gestions': props<{ gestions: Gestion[] }>(),
    'Add Gestion': props<{ gestion: Gestion }>(),
    'Upsert Gestion': props<{ gestion: Gestion }>(),
    'Add Gestions': props<{ gestions: Gestion[] }>(),
    'Upsert Gestions': props<{ gestions: Gestion[] }>(),
    'Update Gestion': props<{ gestion: Update<Gestion> }>(),
    'Update Gestions': props<{ gestions: Update<Gestion>[] }>(),
    'Delete Gestion': props<{ id: string }>(),
    'Delete Gestions': props<{ ids: string[] }>(),
    'Clear Gestions': emptyProps(),
  }
});
