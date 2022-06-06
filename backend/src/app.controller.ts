import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { FindManyOptions, FindOptionsOrder, Repository } from 'typeorm';
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
  async getDonations() {
    const [donations, total] = await this.flowEventRepository.findAndCount({
      order: { blockTimestamp: 'desc' },
    });
    return { total, donations };
  }

  @Get('users')
  getUsers() {
    return this.userRepository.find();
  }

  @Get('users/:address')
  async getUser(@Param('address') address) {
    const order: FindOptionsOrder<EventEntity> = { blockTimestamp: 'desc' };
    const [user, from, to] = await Promise.all([
      this.userRepository.findOneOrFail({ where: { address } }),
      this.flowEventRepository.find({
        where: { from: address },
        order,
      }),
      this.flowEventRepository.find({
        where: { to: address },
        order,
      }),
    ]);
    return {
      user,
      from,
      to,
    };
  }

  @Get('users/:address/donations')
  async getUserDonations(@Param('address') address) {
    const opts: FindManyOptions = {
      where: { to: address },
      order: { blockTimestamp: 'desc' },
    };
    const [from, to] = await Promise.all([
      this.flowEventRepository.find(opts),
      this.flowEventRepository.find(opts),
    ]);
    return {
      from,
      to,
    };
  }
}
