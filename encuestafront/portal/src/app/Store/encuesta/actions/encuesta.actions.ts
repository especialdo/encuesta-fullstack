import { createActionGroup, emptyProps, props } from '@ngrx/store';

import {
  CrearEncuestaRequestDto,
  EncuestaResponseDto,
  ResponderEncuestaRequestDto,
} from '../../../dto/EncuestaDto';
export const EncuestasActions = createActionGroup({
  source: 'Encuestas',
  events: {
    // Cargar mis encuestas
    'Load Mis Encuestas': emptyProps(),
    'Load Mis Encuestas Success': props<{ encuestas: EncuestaResponseDto[] }>(),
    'Load Mis Encuestas Failure': props<{ error: string }>(),

    // Cargar encuesta pública
    'Load Encuesta Publica': props<{ id: number }>(),
    'Load Encuesta Publica Success': props<{ encuesta: EncuestaResponseDto }>(),
    'Load Encuesta Publica Failure': props<{ error: string }>(),

    // Crear encuesta
    'Crear Encuesta': props<{ dto: CrearEncuestaRequestDto }>(),
    'Crear Encuesta Success': props<{ encuesta: EncuestaResponseDto }>(),
    'Crear Encuesta Failure': props<{ error: string }>(),

    // Responder encuesta
    'Responder Encuesta': props<{ id: number; dto: ResponderEncuestaRequestDto }>(),
    'Responder Encuesta Success': emptyProps(),
    'Responder Encuesta Failure': props<{ error: string }>(),

    // Eliminar encuesta
    'Eliminar Encuesta': props<{ id: number }>(),
    'Eliminar Encuesta Success': props<{ id: number }>(),
    'Eliminar Encuesta Failure': props<{ error: string }>(),

    // Limpiar estado
    'Clear Success': emptyProps(),
    'Clear Error': emptyProps(),
  },
});
