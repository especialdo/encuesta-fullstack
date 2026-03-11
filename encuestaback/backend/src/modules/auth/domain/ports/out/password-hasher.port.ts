import { Observable } from 'rxjs';

export const PASSWORD_HASHER_PORT = Symbol('PASSWORD_HASHER_PORT');

export interface PasswordHasherPort {
  hash(plain: string): Observable<string>;
  compare(plain: string, hashed: string): Observable<boolean>;
}
