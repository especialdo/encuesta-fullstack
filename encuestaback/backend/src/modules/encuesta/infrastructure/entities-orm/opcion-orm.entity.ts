import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'opciones' })
export class OpcionOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  texto: string;

  @ManyToOne('PreguntaOrmEntity', 'opciones', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'pregunta_id' })
  pregunta: any;

  @Column({ name: 'pregunta_id' })
  preguntaId: number;

  @OneToMany('RespuestaOrmEntity', 'opcion')
  respuestas: any[];
}
