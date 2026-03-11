/**
 * Value Object: Email
 * Garantiza que cualquier email en el dominio sea válido.
 */
export class Email {
  private static readonly REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  private constructor(private readonly _value: string) {}

  static create(value: string): Email {
    if (!value || !Email.REGEX.test(value)) {
      throw new Error(`Email inválido: "${value}"`);
    }
    return new Email(value.toLowerCase().trim());
  }

  get value(): string {
    return this._value;
  }

  equals(other: Email): boolean {
    return this._value === other._value;
  }

  toString(): string {
    return this._value;
  }
}
