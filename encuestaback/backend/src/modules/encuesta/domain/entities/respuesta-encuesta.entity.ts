export class RespuestaItem {
  constructor(
    public readonly preguntaId: number,
    public readonly opcionId: number | null,
    public readonly respuestaTexto: string | null,
  ) {}
}

export class RespuestaEncuesta {
  private constructor(
    private readonly _id: number,
    private readonly _encuestaId: number,
    private readonly _nombreRespondente: string,
    private readonly _respuestas: RespuestaItem[],
    private readonly _fechaRespuesta: Date,
  ) {}

  static create(props: {
    id: number;
    encuestaId: number;
    nombreRespondente: string;
    respuestas: RespuestaItem[];
    fechaRespuesta?: Date;
  }): RespuestaEncuesta {
    if (!props.nombreRespondente?.trim()) {
      throw new Error('El nombre del respondente es requerido');
    }
    if (!props.respuestas?.length) {
      throw new Error('Debe incluir al menos una respuesta');
    }
    return new RespuestaEncuesta(
      props.id,
      props.encuestaId,
      props.nombreRespondente.trim(),
      props.respuestas,
      props.fechaRespuesta ?? new Date(),
    );
  }

  get id(): number {
    return this._id;
  }
  get encuestaId(): number {
    return this._encuestaId;
  }
  get nombreRespondente(): string {
    return this._nombreRespondente;
  }
  get respuestas(): RespuestaItem[] {
    return this._respuestas;
  }
  get fechaRespuesta(): Date {
    return this._fechaRespuesta;
  }
}
