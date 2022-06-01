import { EventBroadcasterInterface } from '@rayvin-flow/flow-scanner-lib/lib/broadcaster/event-broadcaster';
import { FlowEvent } from '@rayvin-flow/flow-scanner-lib/lib/flow/models/flow-event';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService implements EventBroadcasterInterface {
  async broadcastEvents(
    blockHeight: number,
    events: FlowEvent[],
  ): Promise<void> {
    console.log(blockHeight, events);
  }

  destroy(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
