import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEntity } from './entities/donation.entity';
import { FindOptionsOrder, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { FlowSignature } from './fcl';
import { IsEmail, IsString } from 'class-validator';
import { UserService } from './services/user.service';

class EmailUpdateDto {
  signature: [FlowSignature];
  @IsEmail()
  email: string;
}

class EmailGetDto {
  signature: [FlowSignature];
}

@Controller()
export class AppController {
  constructor(
    @InjectRepository(DonationEntity)
    private donationRepository: Repository<DonationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userService: UserService,
  ) {}

  @Get('donations')
  async getDonations() {
    const [donations, total] = await this.donationRepository.findAndCount({
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
    return this.userService.getUserInfo(address);
  }

  @Get('users/:address/donations')
  async getUserDonations(@Param('address') address) {
    return this.userService.getUserDonations(address);
  }

  @Post('users/:address/email')
  async getUserEmailInfo(@Param('address') address, @Body() data: EmailGetDto) {
    return this.userService.getEmail(address, data.signature);
  }

  @Put('users/email')
  async updateUserEmailInfo(@Body() data: EmailUpdateDto) {
    return this.userService.updateEmail(data.email, data.signature);
  }
}
