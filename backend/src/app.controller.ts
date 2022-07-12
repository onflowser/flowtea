import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  PayloadTooLargeException,
  Post,
  Put,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEntity } from './entities/donation.entity';
import { FindOptionsOrder, Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { FlowSignature } from './fcl';
import { IsEmail, IsString } from 'class-validator';
import { UserService } from './services/user.service';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @Post('users/:address/photo')
  @UseInterceptors(FileInterceptor('file'))
  uploadUserAvatar(
    @Param('address') address,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
      throw new BadRequestException('File type not supported');
    }
    // TODO: implement file validator pipe (see https://docs.nestjs.com/techniques/file-upload#file-validation)
    if (file.size > 5000000) {
      throw new PayloadTooLargeException('File too large');
    }
    return this.userService.updateProfilePicture(address, file);
  }

  @Put('users/email')
  async updateUserEmailInfo(@Body() data: EmailUpdateDto) {
    return this.userService.updateEmail(data.email, data.signature);
  }
}
