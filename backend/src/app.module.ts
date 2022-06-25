import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { FlowService } from './flow.service';
import { EventEntity } from './event.entity';
import { ProcessingService } from './processing.service';
import { ScheduleModule } from '@nestjs/schedule';
import { UserEntity } from './user.entity';
import { EmailService } from './email.service';

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
  providers: [EventService, FlowService, ProcessingService, EmailService],
})
export class AppModule {}
