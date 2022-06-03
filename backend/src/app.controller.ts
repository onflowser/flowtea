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

  @Get('donations')
  getAllDonations() {
    return this.flowEventRepository.find();
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find();
  }

  @Get('users/:address')
  async getUser(@Param('address') address) {
    const [user, from, to] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { address } }),
      this.flowEventRepository.find({ where: { from: address } }),
      this.flowEventRepository.find({ where: { to: address } }),
    ]);
    return {
      user,
      from,
      to,
    };
  }
}
