import { Pregunta } from './pregunta.entity';

export class Encuesta {
  private constructor(
    private readonly _id: number,
    private _titulo: string,
    private _descripcion: string,
    private readonly _creadorId: string,
    private _preguntas: Pregunta[],
    private readonly _fechaCreacion: Date,
  ) {}

  static create(props: {
    id: number;
    titulo: string;
    descripcion: string;
    creadorId: string;
    preguntas?: Pregunta[];
    fechaCreacion?: Date;
  }): Encuesta {
    return new Encuesta(
      props.id,
      props.titulo,
      props.descripcion,
      props.creadorId,
      props.preguntas ?? [],
      props.fechaCreacion ?? new Date(),
    );
  }

  get id(): number {
    return this._id;
  }
  get titulo(): string {
    return this._titulo;
  }
  get descripcion(): string {
    return this._descripcion;
  }
  get creadorId(): string {
    return this._creadorId;
  }
  get preguntas(): Pregunta[] {
    return this._preguntas;
  }
  get fechaCreacion(): Date {
    return this._fechaCreacion;
  }

  tienePreguntas(): boolean {
    return this._preguntas.length > 0;
  }
}
