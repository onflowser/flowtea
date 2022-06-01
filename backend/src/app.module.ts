import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventService } from './event.service';
import { FlowService } from './flow.service';
import { EventEntity } from './event.entity';
import { ProcessingService } from './processing.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot(),
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
    TypeOrmModule.forFeature([EventEntity]),
  ],
  controllers: [AppController],
  providers: [EventService, FlowService, ProcessingService],
})
export class AppModule {}
