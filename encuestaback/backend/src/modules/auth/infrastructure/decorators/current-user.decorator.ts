import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { TokenPayload } from '../../domain/ports/out/token-payload.port';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): TokenPayload =>
    ctx.switchToHttp().getRequest().user,
);
