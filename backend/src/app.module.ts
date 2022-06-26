import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventBroadcasterService } from './services/event-broadcaster.service';
import { ScannerService } from './services/scanner.service';
import { DonationEntity } from './entities/donation.entity';
import { CronService } from './services/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserEntity } from './entities/user.entity';
import { EmailService } from './services/email.service';
import { UserService } from './services/user.service';
import { ScannerSettingsService } from './services/scanner-settings.service';
import { ScannerSettingsEntity } from './entities/scanner-settings.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    // TODO: extract DB access config to .env files
    TypeOrmModule.forRoot({
      type: 'mariadb',
      host: 'localhost',
      port: 3306,
      username: '',
      password: '',
      database: 'test',
      entities: [],
      autoLoadEntities: true,
      synchronize: true, // TODO: remove this in production and write migrations instead
    }),
    TypeOrmModule.forFeature([
      DonationEntity,
      UserEntity,
      ScannerSettingsEntity,
    ]),
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
    }),
  ],
  controllers: [AppController],
  providers: [
    EventBroadcasterService,
    ScannerService,
    ScannerSettingsService,
    CronService,
    EmailService,
    UserService,
  ],
})
export class AppModule {}
