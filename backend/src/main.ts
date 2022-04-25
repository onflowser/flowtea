import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FlowService } from './flow.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const flow = app.get(FlowService);
  flow.init([
    'A.f8d6e0586b0a20c7.FlowManager.AccountAdded',
    'A.01cf0e2f2f715450.TeaProfile.Registration',
  ]);
  flow.start();
  await app.listen(3000);
}
bootstrap();
