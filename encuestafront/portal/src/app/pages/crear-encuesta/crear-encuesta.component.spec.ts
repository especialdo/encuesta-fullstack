import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEncuestaComponent } from './crear-encuesta.component';

describe('CrearEncuestaComponent', () => {
  let component: CrearEncuestaComponent;
  let fixture: ComponentFixture<CrearEncuestaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearEncuestaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearEncuestaComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
