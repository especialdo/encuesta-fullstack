import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'respuestas' })
export class RespuestaOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne('PreguntaOrmEntity', 'respuestas')
  @JoinColumn({ name: 'pregunta_id' })
  pregunta: any;

  @Column({ name: 'pregunta_id' })
  preguntaId: number;

  @ManyToOne('RespuestaEncuestaOrmEntity', 'respuestas', {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'respuesta_encuesta_id' })
  respuestaEncuesta: any;

  @ManyToOne('OpcionOrmEntity', 'respuestas', { nullable: true, eager: true })
  @JoinColumn({ name: 'opcion_id' })
  opcion: any;

  @Column({ name: 'opcion_id', nullable: true })
  opcionId: number;

  @Column({ name: 'respuesta_texto', nullable: true })
  respuestaTexto: string;
}
