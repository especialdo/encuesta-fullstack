import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';

import { CrearEncuestaUseCase } from '@modules/encuesta/application/use-cases/encuesta.use-cases';
import { ObtenerEncuestaUseCase } from '@modules/encuesta/application/use-cases/encuesta.use-cases';
import { ListarEncuestasUseCase } from '@modules/encuesta/application/use-cases/encuesta.use-cases';
import { EliminarEncuestaUseCase } from '@modules/encuesta/application/use-cases/encuesta.use-cases';
import { ResponderEncuestaUseCase } from '@modules/encuesta/application/use-cases/encuesta.use-cases';
import { VerRespuestasUseCase } from '@modules/encuesta/application/use-cases/encuesta.use-cases';
import {
  CrearEncuestaDto,
  EncuestaResponseDto,
  ResponderEncuestaDto,
  RespuestaEncuestaResponseDto,
} from '@modules/encuesta/application/dtos/encuesta.dto';

import { Public } from '@modules/auth/infrastructure/decorators/public.decorator';
import { CurrentUser } from '@modules/auth/infrastructure/decorators/current-user.decorator';
import type { TokenPayload } from '@modules/auth/domain/ports/out/token-payload.port';

@ApiTags('Encuestas')
@Controller({ path: 'encuestas', version: '1' })
export class EncuestaController {
  constructor(
    private readonly crearEncuesta: CrearEncuestaUseCase,
    private readonly obtenerEncuesta: ObtenerEncuestaUseCase,
    private readonly listarEncuestas: ListarEncuestasUseCase,
    private readonly eliminarEncuesta: EliminarEncuestaUseCase,
    private readonly responderEncuesta: ResponderEncuestaUseCase,
    private readonly verRespuestas: VerRespuestasUseCase,
  ) {}

  // ── Rutas autenticadas ──────────────────────────────────────────────────────

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Crear encuesta (requiere token)' })
  @ApiResponse({ status: 201, type: EncuestaResponseDto })
  crear(
    @Body() dto: CrearEncuestaDto,
    @CurrentUser() user: TokenPayload,
  ): Observable<EncuestaResponseDto> {
    return this.crearEncuesta.execute(dto, user);
  }

  @Get('mis-encuestas')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar mis encuestas (requiere token)' })
  @ApiResponse({ status: 200, type: [EncuestaResponseDto] })
  listar(@CurrentUser() user: TokenPayload): Observable<EncuestaResponseDto[]> {
    return this.listarEncuestas.execute(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Eliminar encuesta (requiere token)' })
  eliminar(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: TokenPayload,
  ): Observable<void> {
    return this.eliminarEncuesta.execute(id, user);
  }

  @Get(':id/respuestas')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ver respuestas de una encuesta (requiere token)' })
  @ApiResponse({ status: 200, type: [RespuestaEncuestaResponseDto] })
  respuestas(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<RespuestaEncuestaResponseDto[]> {
    return this.verRespuestas.execute(id);
  }

  // ── Rutas públicas ──────────────────────────────────────────────────────────

  @Public()
  @Get(':id/publica')
  @ApiOperation({ summary: 'Ver encuesta para responder (público)' })
  @ApiResponse({ status: 200, type: EncuestaResponseDto })
  obtenerPublica(
    @Param('id', ParseIntPipe) id: number,
  ): Observable<EncuestaResponseDto> {
    return this.obtenerEncuesta.execute(id);
  }

  @Public()
  @Post(':id/responder')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Responder encuesta — solo nombre + respuestas (público)',
  })
  @ApiResponse({ status: 201, type: RespuestaEncuestaResponseDto })
  responder(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ResponderEncuestaDto,
  ): Observable<RespuestaEncuestaResponseDto> {
    return this.responderEncuesta.execute(id, dto);
  }
}
