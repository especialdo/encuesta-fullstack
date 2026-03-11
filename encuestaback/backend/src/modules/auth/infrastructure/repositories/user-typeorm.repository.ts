import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { from, Observable, switchMap, map, of } from 'rxjs';

import { UserMapper } from '../mappers/user.mapper';
import { UserRepositoryPort } from '../../domain/ports/out/user-repository.port';
import { UserOrmEntity } from '../entities/user-orm.entity';
import { User } from '../../domain/entities/user';

/**
 * Adaptador de infraestructura (driven adapter).
 * Implementa el puerto de repositorio usando TypeORM + PostgreSQL.
 * Todas las operaciones son reactivas (Observable<T>).
 */
@Injectable()
export class UserTypeOrmRepository implements UserRepositoryPort {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
    private readonly mapper: UserMapper,
  ) {}

  save(user: User): Observable<User> {
    const orm = this.mapper.toOrm(user);
    console.log('ORM', orm);
    return from(this.repo.save(orm)).pipe(
      map((saved) => this.mapper.toDomain(saved)),
    );
  }

  findById(id: string): Observable<User | null> {
    return from(this.repo.findOne({ where: { id } })).pipe(
      map((orm) => (orm ? this.mapper.toDomain(orm) : null)),
    );
  }

  findByEmail(email: string): Observable<User | null> {
    return from(this.repo.findOne({ where: { email } })).pipe(
      map((orm) => (orm ? this.mapper.toDomain(orm) : null)),
    );
  }

  findAll(
    page: number,
    limit: number,
  ): Observable<{ users: User[]; total: number }> {
    const skip = (page - 1) * limit;
    return from(
      this.repo.findAndCount({
        skip,
        take: limit,
        order: { createdAt: 'DESC' },
      }),
    ).pipe(
      map(([orms, total]) => ({
        users: orms.map((o) => this.mapper.toDomain(o)),
        total,
      })),
    );
  }

  update(user: User): Observable<User> {
    const orm = this.mapper.toOrm(user);
    return from(this.repo.save(orm)).pipe(
      map((saved) => this.mapper.toDomain(saved)),
    );
  }

  delete(id: string): Observable<void> {
    return from(this.repo.delete(id)).pipe(map(() => undefined));
  }

  existsByEmail(email: string): Observable<boolean> {
    return from(this.repo.exists({ where: { email } }));
  }
}
