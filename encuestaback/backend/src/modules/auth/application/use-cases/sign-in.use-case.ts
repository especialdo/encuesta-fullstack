import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable, switchMap, map } from 'rxjs';
import {
  USER_REPOSITORY_PORT,
  type UserRepositoryPort,
} from '../../domain/ports/out/user-repository.port';
import {
  PASSWORD_HASHER_PORT,
  type PasswordHasherPort,
} from '../../domain/ports/out/password-hasher.port';
import { type AuthTokens } from '../../domain/ports/out/token-payload.port';

export class SignInDto {
  email: string;
  password: string;
}

@Injectable()
export class SignInUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepo: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_PORT) private readonly hasher: PasswordHasherPort,
    private readonly jwtService: JwtService,
  ) {}

  execute(dto: SignInDto): Observable<AuthTokens> {
    return this.userRepo.findByEmail(dto.email).pipe(
      switchMap((user) => {
        if (!user || !user.isActive())
          throw new UnauthorizedException('Credenciales inválidas 1');
        return this.hasher.compare(dto.password, user.passwordHash).pipe(
          map((isValid) => {
            if (!isValid)
              throw new UnauthorizedException('Credenciales inválidas 2');
            return {
              access_token: this.jwtService.sign({
                sub: user.id,
                email: user.email.value,
                role: user.role,
              }),
            };
          }),
        );
      }),
    );
  }
}
