import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventBroadcasterService } from './services/event-broadcaster.service';
import { FlowScannerService } from './services/flow-scanner.service';
import { EventEntity } from './entities/event.entity';
import { CronService } from './services/cron.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserEntity } from './entities/user.entity';
import { EmailService } from './services/email.service';

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
    TypeOrmModule.forFeature([EventEntity, UserEntity]),
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`],
    }),
  ],
  controllers: [AppController],
  providers: [
    EventBroadcasterService,
    FlowScannerService,
    CronService,
    EmailService,
  ],
})
export class AppModule {}
