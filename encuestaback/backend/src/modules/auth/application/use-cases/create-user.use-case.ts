import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { Observable, switchMap, map, tap } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { USER_REPOSITORY_PORT } from '../../domain/ports/out/user-repository.port';
import type { UserRepositoryPort } from '../../domain/ports/out/user-repository.port';

import { CreateUserDto, UserResponseDto } from '../dtos/user.dto';
import { UserAssembler } from './user.assembler';
import { User } from '@modules/auth/domain/entities/user';

/**
 * Caso de uso: Crear usuario.
 * Orquesta la lógica de aplicación llamando al puerto de repositorio.
 */
@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  execute(dto: CreateUserDto): Observable<UserResponseDto> {
    return this.userRepo.existsByEmail(dto.email).pipe(
      tap((exists) => {
        if (exists) {
          throw new ConflictException(
            `Ya existe un usuario con el email ${dto.email}`,
          );
        }
      }),
      switchMap(() => {
        const user = User.create({
          id: uuidv4(),
          name: dto.name,
          email: dto.email,
          passwordHash: dto.passwordHash,
          role: dto.role,
        });
        return this.userRepo.save(user);
      }),
      map(UserAssembler.toResponse),
    );
  }
}
