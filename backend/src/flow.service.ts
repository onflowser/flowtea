import { Injectable } from '@nestjs/common';
import { FlowScanner } from '@rayvin-flow/flow-scanner-lib';
import { ConfigProvider } from '@rayvin-flow/flow-scanner-lib/lib/providers/config-provider';
import { MemorySettingsService } from '@rayvin-flow/flow-scanner-lib/lib/settings/memory-settings-service';
import { EventService } from './event.service';

@Injectable()
export class FlowService {
  private flowScanner: FlowScanner;
  private maxRetries = 100;
  private retries = 0;

  constructor(private readonly eventService: EventService) {}

  init(monitorEvents = []) {
    console.log('Listening for events: ', monitorEvents);
    // create provider for configuration (these are the minimum required values)
    const configProvider: ConfigProvider = () => ({
      defaultStartBlockHeight: undefined, // this is the block height that the scanner will start from on the very first run (undefined to start at the latest block)
      flowAccessNode: 'http://localhost:8080', // access node to use for Flow API requests
      maxFlowRequestsPerSecond: 10, // maximum number of requests to make to the Flow API per second
    });

    // create the service that will persist settings (in this case, it is just in-memory)
    const settingsService = new MemorySettingsService();
    this.flowScanner = new FlowScanner(
      // event types to monitor
      monitorEvents,
      // pass in the configured providers
      {
        configProvider: configProvider,
        eventBroadcasterProvider: async () => this.eventService,
        settingsServiceProvider: async () => settingsService,
      },
    );
  }

  async start() {
    if (!this.flowScanner) {
      throw new Error('Flow service not initialised');
    }
    console.log('Starting');
    try {
      await this.flowScanner.start();
    } catch (e) {
      console.log('Scanner start error:', e.message);
      await this.stop();
      this.retries++;
      if (this.retries < this.maxRetries) {
        console.log('Retrying...');
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
