import { createFeature, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Gestion } from '../models/gestion.model';
import { GestionActions } from '../actions/gestion.actions';

export const gestionsFeatureKey = 'gestions';

export interface State extends EntityState<Gestion> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Gestion> = createEntityAdapter<Gestion>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(GestionActions.addGestion,
    (state, action) => adapter.addOne(action.gestion, state)
  ),
  on(GestionActions.upsertGestion,
    (state, action) => adapter.upsertOne(action.gestion, state)
  ),
  on(GestionActions.addGestions,
    (state, action) => adapter.addMany(action.gestions, state)
  ),
  on(GestionActions.upsertGestions,
    (state, action) => adapter.upsertMany(action.gestions, state)
  ),
  on(GestionActions.updateGestion,
    (state, action) => adapter.updateOne(action.gestion, state)
  ),
  on(GestionActions.updateGestions,
    (state, action) => adapter.updateMany(action.gestions, state)
  ),
  on(GestionActions.deleteGestion,
    (state, action) => adapter.removeOne(action.id, state)
  ),
  on(GestionActions.deleteGestions,
    (state, action) => adapter.removeMany(action.ids, state)
  ),
  on(GestionActions.loadGestions,
    (state, action) => adapter.setAll(action.gestions, state)
  ),
  on(GestionActions.clearGestions,
    state => adapter.removeAll(state)
  ),
);

export const gestionsFeature = createFeature({
  name: gestionsFeatureKey,
  reducer,
  extraSelectors: ({ selectGestionsState }) => ({
    ...adapter.getSelectors(selectGestionsState)
  }),
});

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = gestionsFeature;
