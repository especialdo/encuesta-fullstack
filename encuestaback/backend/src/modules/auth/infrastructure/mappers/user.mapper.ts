import { Injectable } from '@nestjs/common';

import { UserOrmEntity } from '../entities/user-orm.entity';
import { User } from '../../domain/entities/user';

/**
 * Mapper de infraestructura.
 * Convierte entre la entidad de dominio (User) y la entidad ORM (UserOrmEntity).
 * Aísla al dominio de cualquier dependencia de TypeORM.
 */
@Injectable()
export class UserMapper {
  toDomain(orm: UserOrmEntity): User {
    return User.create({
      id: orm.id,
      name: orm.name,
      email: orm.email,
      passwordHash: orm.passwordHash,
      role: orm.role,
      status: orm.status,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  toOrm(domain: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = domain.id;
    orm.name = domain.name;
    orm.email = domain.email.value;
    orm.passwordHash = domain.passwordHash;
    orm.role = domain.role;
    orm.status = domain.status;
    orm.createdAt = domain.createdAt;
    orm.updatedAt = domain.updatedAt;
    return orm;
  }
}
