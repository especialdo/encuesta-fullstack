import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { UserRole } from '../../domain/value-objects/user-role.vo';
import { UserStatus } from '../../domain/value-objects/user-status.vo';

/**
 * Entidad ORM — exclusiva de infraestructura.
 * Mapea la tabla `users` de PostgreSQL a través de decoradores de TypeORM.
 * NO debe usarse directamente en capas de dominio o aplicación.
 */
@Entity({ name: 'users', schema: 'public' })
export class UserOrmEntity {
  @PrimaryColumn({ type: 'uuid', name: 'id' })
  id: string;

  @Column({ type: 'varchar', length: 120, name: 'name', nullable: false })
  name: string;

  @Index('idx_users_email', { unique: true })
  @Column({
    type: 'varchar',
    length: 255,
    name: 'email',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ type: 'varchar', name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    name: 'role',
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({
    type: 'enum',
    enum: UserStatus,
    name: 'status',
    default: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
