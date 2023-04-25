import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({
    nullable: true,
  })
  avatar: string;

  @Column('simple-array', {
    nullable: true,
  })
  roles: string[];

  @Column('mediumtext', {
    nullable: true,
  })
  intro: string;

  @Column()
  status: boolean;

  @Column({
    select: false,
  })
  created_at: string;

  @Column()
  updated_at: string;
}
