import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FlowService } from './flow.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FlowService],
})
export class AppModule {}
