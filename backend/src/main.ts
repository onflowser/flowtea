import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FlowService } from './flow.service';

// contract deployment address
const { FLOWTEA_ACCOUNT_ADDRESS } = process.env;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const flow = app.get(FlowService);
  flow.init([
    `A.${FLOWTEA_ACCOUNT_ADDRESS.replace('0x', '')}.TeaDonation.Donation`,
  ]);
  flow.start();
  await app.listen(3000);
}

if (!FLOWTEA_ACCOUNT_ADDRESS) {
  console.log('FLOWTEA_ACCOUNT_ADDRESS env variable unset!');
  process.exit(1);
}

bootstrap();
