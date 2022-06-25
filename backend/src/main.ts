import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FlowScannerService } from './services/flow-scanner.service';
import { ValidationPipe } from '@nestjs/common';

// contract deployment address
const { FLOWTEA_ACCOUNT_ADDRESS } = process.env;
const address = FLOWTEA_ACCOUNT_ADDRESS.replace('0x', '');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*' });
  app.useGlobalPipes(new ValidationPipe());

  const flowService = app.get(FlowScannerService);
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
