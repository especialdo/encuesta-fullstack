import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { Public } from '../../decorators/public.decorator';
import type { TokenPayload } from '@modules/auth/domain/ports/out/token-payload.port';
import { CurrentUser } from '../../decorators/current-user.decorator';
import {
  RegisterDto,
  RegisterUseCase,
} from '@modules/auth/application/use-cases/register.use-case';
import {
  SignInDto,
  SignInUseCase,
} from '@modules/auth/application/use-cases/sign-in.use-case';
import { RegisterResponseDto } from '@modules/auth/application/dtos/user.dto';

@ApiTags('Auth')
@Controller({ path: 'auth' })
export class AuthController {
  constructor(
    private readonly register: RegisterUseCase,
    private readonly signIn: SignInUseCase,
  ) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registro' })
  doRegister(@Body() dto: RegisterDto): Observable<RegisterResponseDto> {
    return this.register.execute(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login → JWT' })
  doLogin(@Body() dto: SignInDto): Observable<{ access_token: string }> {
    return this.signIn.execute(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mi perfil del token' })
  getMe(@CurrentUser() user: TokenPayload) {
    return user;
  }
}
