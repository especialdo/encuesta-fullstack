import { TipoPregunta } from '../value-objects/tipo-pregunta.vo';
import { Opcion } from './opcion.entity';

export class Pregunta {
  private constructor(
    private readonly _id: number,
    private _texto: string,
    private _tipo: TipoPregunta,
    private _opciones: Opcion[],
  ) {}

  static create(props: {
    id: number;
    texto: string;
    tipo: TipoPregunta;
    opciones?: Opcion[];
  }): Pregunta {
    return new Pregunta(
      props.id,
      props.texto,
      props.tipo,
      props.opciones ?? [],
    );
  }

  get id(): number {
    return this._id;
  }
  get texto(): string {
    return this._texto;
  }
  get tipo(): TipoPregunta {
    return this._tipo;
  }
  get opciones(): Opcion[] {
    return this._opciones;
  }

  esAbierta(): boolean {
    return this._tipo === TipoPregunta.ABIERTA;
  }
  esCerrada(): boolean {
    return this._tipo === TipoPregunta.CERRADA;
  }
  esMultiple(): boolean {
    return this._tipo === TipoPregunta.MULTIPLE;
  }
}
