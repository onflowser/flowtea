import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryColumn()
  address: string;

  @Column({ nullable: true })
  name: string | null;

  @Column({ type: 'datetime', nullable: true })
  createdAt: Date | null;

  @Column({ nullable: true })
  email: string | null;
}
