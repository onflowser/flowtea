import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ProcessingService {
  constructor(
    @InjectRepository(EventEntity)
    private flowEventRepository: Repository<EventEntity>,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS) // TODO: set longer interval in production
  async handleCron() {
    const dayDiffThreshold = 30;
    const events = await this.flowEventRepository
      .createQueryBuilder('q')
      .select()
      .where('DATEDIFF(q.blockTimestamp, :d) % :n = 0', {
        d: new Date().toISOString(),
        n: dayDiffThreshold,
      })
      .getMany();

    console.log({ events }); // TODO: process this events (send emails)
  }
}
