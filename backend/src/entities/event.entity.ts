import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'event' })
export class EventEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  blockId: string;

  @Column()
  blockHeight: number;

  @Column({ type: 'datetime' })
  blockTimestamp: Date;

  @Column()
  transactionId: string;

  @Column()
  transactionIndex: number;

  @Column()
  eventIndex: number;

  @Column()
  type: string;

  @Column()
  from: string;

  @Column()
  to: string;

  @Column()
  amount: number;

  @Column()
  message: string;

  @Column()
  recurring: boolean;
}
