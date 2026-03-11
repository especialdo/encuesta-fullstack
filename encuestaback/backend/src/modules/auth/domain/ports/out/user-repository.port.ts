import { Observable } from 'rxjs';
import { User } from '../../entities/user';

/**
 * Puerto de salida (driven port).
 * Define el contrato que el dominio exige al repositorio.
 * La implementación concreta vive en infraestructura.
 */
export const USER_REPOSITORY_PORT = Symbol('USER_REPOSITORY_PORT');

export interface UserRepositoryPort {
  save(user: User): Observable<User>;
  findById(id: string): Observable<User | null>;
  findByEmail(email: string): Observable<User | null>;
  findAll(
    page: number,
    limit: number,
  ): Observable<{ users: User[]; total: number }>;
  update(user: User): Observable<User>;
  delete(id: string): Observable<void>;
  existsByEmail(email: string): Observable<boolean>;
}
