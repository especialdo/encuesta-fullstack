import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/encuestas',
})
export class EncuestaGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(EncuestaGateway.name);

  // ─── Conexión ─────────────────────────────────────────────────────────────
  handleConnection(client: Socket): void {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  // ─── El admin se une a la sala de una encuesta ────────────────────────────
  @SubscribeMessage('join-encuesta')
  handleJoinEncuesta(
    @MessageBody() data: { encuestaId: number },
    @ConnectedSocket() client: Socket,
  ): void {
    const room = `encuesta-${data.encuestaId}`;
    client.join(room);
    this.logger.log(`Cliente ${client.id} se unió a sala: ${room}`);
    client.emit('joined', { room, encuestaId: data.encuestaId });
  }

  // ─── El admin abandona la sala ────────────────────────────────────────────
  @SubscribeMessage('leave-encuesta')
  handleLeaveEncuesta(
    @MessageBody() data: { encuestaId: number },
    @ConnectedSocket() client: Socket,
  ): void {
    const room = `encuesta-${data.encuestaId}`;
    client.leave(room);
    this.logger.log(`Cliente ${client.id} abandonó sala: ${room}`);
  }

  // ─── Notificar nueva respuesta a todos en la sala ─────────────────────────
  notificarNuevaRespuesta(
    encuestaId: number,
    payload: {
      nombreRespondente: string;
      fechaRespuesta: Date;
      totalRespuestas: number;
    },
  ): void {
    const room = `encuesta-${encuestaId}`;
    this.server.to(room).emit('nueva-respuesta', {
      encuestaId,
      ...payload,
    });
    this.logger.log(`Notificación enviada a sala ${room}`);
  }
}
