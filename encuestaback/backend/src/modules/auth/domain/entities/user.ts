import { UserRole } from '../value-objects/user-role.vo';
import { UserStatus } from '../value-objects/user-status.vo';
import { Email } from '../value-objects/email.vo';

/**
 * Entidad de dominio pura — sin decoradores de framework.
 * Esta es la representación central del negocio.
 */
export class User {
  private constructor(
    private readonly _id: string,
    private _name: string,
    private _email: Email,
    private _passwordHash: string,
    private _role: UserRole,
    private _status: UserStatus,
    private readonly _createdAt: Date,
    private _updatedAt: Date,
  ) {}

  // ── Factory ──────────────────────────────────────────────────────────────
  static create(props: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role?: UserRole;
    status?: UserStatus;
    createdAt?: Date;
    updatedAt?: Date;
  }): User {
    return new User(
      props.id,
      props.name,
      Email.create(props.email),
      props.passwordHash,

      props.role ?? UserRole.USER,
      props.status ?? UserStatus.ACTIVE,
      props.createdAt ?? new Date(),
      props.updatedAt ?? new Date(),
    );
  }

  // ── Getters ───────────────────────────────────────────────────────────────
  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get email(): Email {
    return this._email;
  }
  get passwordHash(): string {
    return this._passwordHash;
  }
  get role(): UserRole {
    return this._role;
  }
  get status(): UserStatus {
    return this._status;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  // ── Comportamiento de dominio ─────────────────────────────────────────────
  activate(): void {
    if (this._status === UserStatus.ACTIVE) {
      throw new Error('El usuario ya está activo');
    }
    this._status = UserStatus.ACTIVE;
    this.touch();
  }

  deactivate(): void {
    if (this._status === UserStatus.INACTIVE) {
      throw new Error('El usuario ya está inactivo');
    }
    this._status = UserStatus.INACTIVE;
    this.touch();
  }

  updateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }
    this._name = name.trim();
    this.touch();
  }

  promoteToAdmin(): void {
    this._role = UserRole.ADMIN;
    this.touch();
  }

  isActive(): boolean {
    return this._status === UserStatus.ACTIVE;
  }

  private touch(): void {
    this._updatedAt = new Date();
  }

  updatePassword(hash: string): void {
    this._passwordHash = hash;
    this.touch();
  }
}
