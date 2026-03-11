import { Module } from '@nestjs/common';
import { EncuestaGateway } from './encuesta-ws/EncuestaGateway';

@Module({ providers: [EncuestaGateway], exports: [EncuestaGateway] })
export class EncuestaWsModule {}
