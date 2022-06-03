import { EventBroadcasterInterface } from '@rayvin-flow/flow-scanner-lib/lib/broadcaster/event-broadcaster';
import { FlowEvent } from '@rayvin-flow/flow-scanner-lib/lib/flow/models/flow-event';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class EventService implements EventBroadcasterInterface {
  constructor(
    @InjectRepository(EventEntity)
    private flowEventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async broadcastEvents(
    blockHeight: number,
    events: FlowEvent[],
  ): Promise<void> {
    console.log(events);
    const registrationEvents = [];
    const donationEvents = [];
    for (const event of events) {
      if (event.type.match(/Donation/)) {
        donationEvents.push(event);
      }
      if (event.type.match(/Registration/)) {
        registrationEvents.push(event);
      }
    }
    await this.processRegistrationEvents(registrationEvents);
    await this.processDonationEvents(donationEvents);
  }

  private async processDonationEvents(events: FlowEvent[]) {
    try {
      await this.flowEventRepository.save(
        events.map(
          (event) =>
            ({
              id: `${event.blockHeight}.${event.transactionId}.${event.eventIndex}`,
              ...event,
              ...event.data,
            } as unknown as EventEntity),
        ),
      );
    } catch (e) {
      console.log(e);
    }
  }

  private async processRegistrationEvents(events: FlowEvent[]) {
    try {
      await this.userRepository.save(
        events.map(
          (event) =>
            ({
              createdAt: event.blockTimestamp,
              ...event.data,
            } as UserEntity),
        ),
      );
    } catch (e) {
      console.log(e);
    }
  }

  destroy(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
