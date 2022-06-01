import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { FlowService } from './flow.service';
import { EventService } from './event.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [EventService, FlowService],
})
export class AppModule {}
