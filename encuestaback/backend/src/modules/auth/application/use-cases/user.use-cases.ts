import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Observable, switchMap, map } from 'rxjs';

import { USER_REPOSITORY_PORT } from '../../domain/ports/out/user-repository.port';
import type { UserRepositoryPort } from '../../domain/ports/out/user-repository.port';
import {
  PaginatedUsersDto,
  UpdateUserDto,
  UserResponseDto,
} from '../dtos/user.dto';
import { UserAssembler } from './user.assembler';

// ── Find One ─────────────────────────────────────────────────────────────────
@Injectable()
export class FindUserByIdUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  execute(id: string): Observable<UserResponseDto> {
    return this.userRepo.findById(id).pipe(
      map((user) => {
        if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
        return UserAssembler.toResponse(user);
      }),
    );
  }
}

// ── Find All (paginado) ───────────────────────────────────────────────────────
@Injectable()
export class FindAllUsersUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  execute(page = 1, limit = 10): Observable<PaginatedUsersDto> {
    return this.userRepo.findAll(page, limit).pipe(
      map(({ users, total }) => ({
        users: users.map(UserAssembler.toResponse),
        total,
        page,
        limit,
      })),
    );
  }
}

// ── Update ────────────────────────────────────────────────────────────────────
@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  execute(id: string, dto: UpdateUserDto): Observable<UserResponseDto> {
    return this.userRepo.findById(id).pipe(
      map((user) => {
        if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
        if (dto.name) user.updateName(dto.name);
        return user;
      }),
      switchMap((user) => this.userRepo.update(user)),
      map(UserAssembler.toResponse),
    );
  }
}

// ── Delete ────────────────────────────────────────────────────────────────────
@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  execute(id: string): Observable<void> {
    return this.userRepo.findById(id).pipe(
      map((user) => {
        if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
        return user;
      }),
      switchMap(() => this.userRepo.delete(id)),
    );
  }
}

// ── Deactivate ────────────────────────────────────────────────────────────────
@Injectable()
export class DeactivateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly userRepo: UserRepositoryPort,
  ) {}

  execute(id: string): Observable<UserResponseDto> {
    return this.userRepo.findById(id).pipe(
      map((user) => {
        if (!user) throw new NotFoundException(`Usuario ${id} no encontrado`);
        user.deactivate();
        return user;
      }),
      switchMap((user) => this.userRepo.update(user)),
      map(UserAssembler.toResponse),
    );
  }
}
