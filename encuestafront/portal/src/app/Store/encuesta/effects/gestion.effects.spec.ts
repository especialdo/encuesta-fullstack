import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { GestionEffects } from './gestion.effects';

describe('GestionEffects', () => {
  let actions$: Observable<any>;
  let effects: GestionEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        GestionEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(GestionEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
