import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectEncuestaActiva } from '../../Store/encuesta/selector/encuesta.selector';
import { selectError, selectLoading } from '../../Store/auth/selector/auth.selector';
import { EncuestasActions } from '../../Store/encuesta/actions/encuesta.actions';
import { PreguntaResponseDto } from '../../dto/EncuestaDto';

@Component({
  selector: 'app-responder-encuesta',
  standalone: false,
  templateUrl: './responder-encuesta.component.html',
  styleUrl: './responder-encuesta.component.scss',
})
export class ResponderEncuestaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private fb = inject(FormBuilder);

  form!: FormGroup;
  encuestaId!: number;

  encuesta$ = this.store.select(selectEncuestaActiva);
  loading$ = this.store.select(selectLoading);
  error$ = this.store.select(selectError);

  submitted = false;

  ngOnInit(): void {
    this.encuestaId = Number(this.route.snapshot.paramMap.get('id'));
    this.store.dispatch(EncuestasActions.loadEncuestaPublica({ id: this.encuestaId }));

    this.form = this.fb.group({
      nombreRespondente: ['', [Validators.required, Validators.minLength(3)]],
      respuestas: this.fb.array([]),
    });

    this.encuesta$.subscribe((encuesta) => {
      if (encuesta) this.buildRespuestas(encuesta.preguntas);
    });
  }

  get respuestasArray(): FormArray {
    return this.form.get('respuestas') as FormArray;
  }

  buildRespuestas(preguntas: PreguntaResponseDto[]): void {
    const arr = this.form.get('respuestas') as FormArray;
    arr.clear();
    preguntas.forEach((p) => {
      arr.push(
        this.fb.group({
          preguntaId: [p.id],
          opcionId: [null],
          respuestaTexto: [''],
        }),
      );
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombreRespondente, respuestas } = this.form.value;
    this.store.dispatch(
      EncuestasActions.responderEncuesta({
        id: this.encuestaId,
        dto: { nombreRespondente, respuestas },
      }),
    );
    this.submitted = true;
  }
}
