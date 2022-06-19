import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FlowService } from './flow.service';

// contract deployment address
const { FLOWTEA_ACCOUNT_ADDRESS } = process.env;
const address = FLOWTEA_ACCOUNT_ADDRESS.replace('0x', '');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  const flowService = app.get(FlowService);
  flowService.init([
    // TODO: handle profile updates
    `A.${address}.FlowTea.Donation`,
    `A.${address}.FlowTea.Registration`,
  ]);
  flowService.start();
  await app.listen(3000);
}

if (!FLOWTEA_ACCOUNT_ADDRESS) {
  console.log('FLOWTEA_ACCOUNT_ADDRESS env variable unset!');
  process.exit(1);
}

bootstrap();
