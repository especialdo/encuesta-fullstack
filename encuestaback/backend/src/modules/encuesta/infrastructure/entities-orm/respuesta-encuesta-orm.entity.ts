import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'respuestas_encuesta' })
export class RespuestaEncuestaOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'nombre_respondente' })
  nombreRespondente: string;

  @CreateDateColumn({ name: 'fecha_respuesta', type: 'timestamptz' })
  fechaRespuesta: Date;

  @ManyToOne('EncuestaOrmEntity', 'respuestas', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'encuesta_id' })
  encuesta: any;

  @Column({ name: 'encuesta_id' })
  encuestaId: number;

  @OneToMany('RespuestaOrmEntity', 'respuestaEncuesta', {
    cascade: true,
    eager: true,
  })
  respuestas: any[];
}
