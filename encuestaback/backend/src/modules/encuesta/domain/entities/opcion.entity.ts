export class Opcion {
  private constructor(
    private readonly _id: number,
    private _texto: string,
  ) {}

  static create(props: { id: number; texto: string }): Opcion {
    return new Opcion(props.id, props.texto);
  }

  get id(): number {
    return this._id;
  }
  get texto(): string {
    return this._texto;
  }
}
