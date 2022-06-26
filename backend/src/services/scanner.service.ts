import { Injectable } from '@nestjs/common';
import { FlowScanner } from '@rayvin-flow/flow-scanner-lib';
import { ConfigProvider } from '@rayvin-flow/flow-scanner-lib/lib/providers/config-provider';
import { EventBroadcasterService } from './event-broadcaster.service';
import { ScannerSettingsService } from './scanner-settings.service';
import { config } from '../config';
import { wait } from '../utils';

@Injectable()
export class ScannerService {
  private flowScanner: FlowScanner;
  private maxRetries = 100;
  private retries = 0;

  constructor(
    private readonly eventService: EventBroadcasterService,
    private scannerSettingsService: ScannerSettingsService,
  ) {}

  init(monitorEvents = []) {
    console.log('Listening for events: ', monitorEvents);
    const configProvider: ConfigProvider = () => ({
      defaultStartBlockHeight: undefined, // Start at the latest block.
      flowAccessNode: config.flow.accessNode,
      maxFlowRequestsPerSecond: 10, // maximum number of requests to make to the Flow API per second
    });

    this.flowScanner = new FlowScanner(monitorEvents, {
      configProvider: configProvider,
      eventBroadcasterProvider: async () => this.eventService,
      settingsServiceProvider: async () => this.scannerSettingsService,
    });
  }

  async start() {
    if (!this.flowScanner) {
      throw new Error('Flow service not initialised');
    }
    console.log('Starting');
    try {
      await this.flowScanner.start();
    } catch (e) {
      await this.stop();
      this.retries++;
      if (this.retries < this.maxRetries) {
        console.log('Retrying...');
        await wait(5000);
        return this.start();
      }
    }
  }

  async stop() {
    // when you are ready to stop the scanner, you can call the stop() method
    console.log('Stopping scanner');
    await this.flowScanner.stop();
  }
}
