// import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FlowService } from './flow.service';

// contract deployment address
const { FLOWTEA_ACCOUNT_ADDRESS } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  const flow = app.get(FlowService);
  const address = FLOWTEA_ACCOUNT_ADDRESS.replace('0x', '');
  flow.init([
    `A.${address}.TeaDonation.Donation`,
    `A.${address}.TeaProfile.Registration`,
  ]);
  flow.start();
  await app.listen(3000);
}

if (!FLOWTEA_ACCOUNT_ADDRESS) {
  console.log('FLOWTEA_ACCOUNT_ADDRESS env variable unset!');
  process.exit(1);
}

bootstrap();
