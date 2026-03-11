import { User } from '@modules/auth/domain/entities/user';
import { UserResponseDto } from '../dtos/user.dto';

/**
 * Assembler de aplicación.
 * Transforma entidades de dominio en DTOs de respuesta.
 */
export class UserAssembler {
  static toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email.value,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
