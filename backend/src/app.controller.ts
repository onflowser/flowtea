import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(EventEntity)
    private flowEventRepository: Repository<EventEntity>,
  ) {}

  @Get(':address')
  getEventsForAddress(@Param('address') address) {
    return this.flowEventRepository.find({
      where: {
        to: address,
      },
    });
  }
}
