import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { UserTypeOrmRepository } from './infrastructure/repositories/user-typeorm.repository';
import { UserMapper } from './infrastructure/mappers/user.mapper';
import { BcryptHasherAdapter } from './infrastructure/adapters/bcrypt-hasher.adapter';
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard';
import { RolesGuard } from './infrastructure/guards/roles.guard';
import { RegisterUseCase } from './application/use-cases/register.use-case';
import { SignInUseCase } from './application/use-cases/sign-in.use-case';
import {
  FindAllUsersUseCase,
  FindUserByIdUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  DeactivateUserUseCase,
} from './application/use-cases/user.use-cases';
import { USER_REPOSITORY_PORT } from './domain/ports/out/user-repository.port';
import { PASSWORD_HASHER_PORT } from './domain/ports/out/password-hasher.port';
import { UserOrmEntity } from './infrastructure/entities/user-orm.entity';
import { AuthController } from './infrastructure/api/controller/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        secret: cfg.get('JWT_SECRET', 'change_me'),
        signOptions: { expiresIn: cfg.get('JWT_EXPIRES_IN', '1d') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserMapper,
    { provide: USER_REPOSITORY_PORT, useClass: UserTypeOrmRepository },
    { provide: PASSWORD_HASHER_PORT, useClass: BcryptHasherAdapter },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    RegisterUseCase,
    SignInUseCase,
    FindAllUsersUseCase,
    FindUserByIdUseCase,
    UpdateUserUseCase,
    DeleteUserUseCase,
    DeactivateUserUseCase,
  ],
})
export class AuthModule {}
