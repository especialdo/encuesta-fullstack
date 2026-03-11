import { Component, inject, OnInit } from '@angular/core';

import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { selectLoadingCrear } from '../../Store/encuesta/selector/encuesta.selector';
import { selectError } from '../../Store/auth/selector/auth.selector';
import { EncuestasActions } from '../../Store/encuesta/actions/encuesta.actions';

@Component({
  selector: 'app-crear-encuesta',
  standalone: false,
  templateUrl: './crear-encuesta.component.html',
  styleUrl: './crear-encuesta.component.scss',
})
export class CrearEncuestaComponent implements OnInit {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  form!: FormGroup;
  loading$ = this.store.select(selectLoadingCrear);
  error$ = this.store.select(selectError);

  tiposPregunta = [
    { value: 'abierta', label: 'Respuesta abierta', icon: 'short_text' },
    { value: 'multiple', label: 'Opción múltiple', icon: 'check_box' },
    { value: 'cerrada', label: 'Única respuesta', icon: 'radio_button_checked' },
  ];

  ngOnInit(): void {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      preguntas: this.fb.array([this.crearPregunta()]),
    });
  }

  get preguntas(): FormArray {
    return this.form.get('preguntas') as FormArray;
  }

  getPreguntaGroup(i: number): FormGroup {
    return this.preguntas.at(i) as FormGroup;
  }

  getOpciones(i: number): FormArray {
    return this.getPreguntaGroup(i).get('opciones') as FormArray;
  }

  crearPregunta(): FormGroup {
    return this.fb.group({
      texto: ['', Validators.required],
      tipo: ['abierta', Validators.required],
      opciones: this.fb.array([]),
    });
  }

  crearOpcion(): FormGroup {
    return this.fb.group({ texto: ['', Validators.required] });
  }

  agregarPregunta(): void {
    this.preguntas.push(this.crearPregunta());
  }

  eliminarPregunta(i: number): void {
    if (this.preguntas.length > 1) this.preguntas.removeAt(i);
  }

  agregarOpcion(preguntaIndex: number): void {
    this.getOpciones(preguntaIndex).push(this.crearOpcion());
  }

  eliminarOpcion(preguntaIndex: number, opcionIndex: number): void {
    this.getOpciones(preguntaIndex).removeAt(opcionIndex);
  }

  onTipoChange(preguntaIndex: number): void {
    const tipo = this.getPreguntaGroup(preguntaIndex).get('tipo')?.value;
    const opciones = this.getOpciones(preguntaIndex);
    opciones.clear();
    if (tipo !== 'abierta') {
      opciones.push(this.crearOpcion());
      opciones.push(this.crearOpcion());
    }
  }

  esConOpciones(i: number): boolean {
    const tipo = this.getPreguntaGroup(i).get('tipo')?.value;
    return tipo === 'multiple' || tipo === 'cerrada';
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    console.log('Payload enviado:', JSON.stringify(this.form.value, null, 2));
    this.store.dispatch(EncuestasActions.crearEncuesta({ dto: this.form.value }));
  }
}
