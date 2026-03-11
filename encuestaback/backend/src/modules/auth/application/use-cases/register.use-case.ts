import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { Observable, switchMap, map } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {
  USER_REPOSITORY_PORT,
  type UserRepositoryPort,
} from '../../domain/ports/out/user-repository.port';
import {
  PASSWORD_HASHER_PORT,
  type PasswordHasherPort,
} from '../../domain/ports/out/password-hasher.port';
import { User } from '../../domain/entities/user';
import { RegisterResponseDto } from '../dtos/user.dto';
export class RegisterDto {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT) private readonly userRepo: UserRepositoryPort,
    @Inject(PASSWORD_HASHER_PORT) private readonly hasher: PasswordHasherPort,
  ) {}

  execute(dto: RegisterDto): Observable<RegisterResponseDto> {
    return this.userRepo.existsByEmail(dto.email).pipe(
      switchMap((exists) => {
        if (exists)
          throw new ConflictException(
            `El email ${dto.email} ya está registrado`,
          );
        return this.hasher.hash(dto.password);
      }),
      switchMap((passwordHash) =>
        this.userRepo.save(
          User.create({
            id: uuidv4(),
            name: dto.name,
            email: dto.email,
            passwordHash,
          }),
        ),
      ),
      map(
        (user): RegisterResponseDto => ({
          id: user.id,
          name: user.name,
          email: user.email.value,
        }),
      ),
    );
  }
}
