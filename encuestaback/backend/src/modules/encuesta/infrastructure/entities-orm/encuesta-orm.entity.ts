import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity({ name: 'encuestas' })
export class EncuestaOrmEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  titulo: string;

  @Column()
  descripcion: string;

  @CreateDateColumn({ name: 'fecha_creacion', type: 'timestamptz' })
  fechaCreacion: Date;

  @ManyToOne('UserOrmEntity', { nullable: false })
  @JoinColumn({ name: 'creador_id' })
  creador: any;

  @Column({ name: 'creador_id' })
  creadorId: string;

  @OneToMany('PreguntaOrmEntity', 'encuesta', { cascade: true, eager: true })
  preguntas: any[];

  @OneToMany('RespuestaEncuestaOrmEntity', 'encuesta')
  respuestas: any[];
}
