import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { type PasswordHasherPort } from '../../domain/ports/out/password-hasher.port';

@Injectable()
export class BcryptHasherAdapter implements PasswordHasherPort {
  private readonly ROUNDS = 10;

  hash(plain: string): Observable<string> {
    return from(bcrypt.hash(plain, this.ROUNDS));
  }

  compare(plain: string, hashed: string): Observable<boolean> {
    return from(bcrypt.compare(plain, hashed));
  }
}
