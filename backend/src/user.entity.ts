import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryColumn()
  address: string;

  @Column()
  name: string;

  @Column({ type: 'datetime' })
  createdAt: Date;

  @Column({ nullable: true })
  email: string;
}
