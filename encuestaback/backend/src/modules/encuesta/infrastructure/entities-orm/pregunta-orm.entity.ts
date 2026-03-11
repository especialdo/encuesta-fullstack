import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'preguntas' })
export class PreguntaOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto: string;

  @Column()
  tipo: string;

  @ManyToOne('EncuestaOrmEntity', 'preguntas', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'encuesta_id' })
  encuesta: any;

  @Column({ name: 'encuesta_id' })
  encuestaId: number;

  @OneToMany('OpcionOrmEntity', 'pregunta', { cascade: true, eager: true })
  opciones: any[];

  @OneToMany('RespuestaOrmEntity', 'pregunta')
  respuestas: any[];
}
