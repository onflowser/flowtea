import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Controller()
export class AppController {
  constructor(
    @InjectRepository(EventEntity)
    private flowEventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  @Get('events/:address')
  getEventsForAddress(@Param('address') address) {
    return this.flowEventRepository.find({
      where: {
        to: address,
      },
    });
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find();
  }
}
