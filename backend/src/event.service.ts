import { EventBroadcasterInterface } from '@rayvin-flow/flow-scanner-lib/lib/broadcaster/event-broadcaster';
import { FlowEvent } from '@rayvin-flow/flow-scanner-lib/lib/flow/models/flow-event';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from './event.entity';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { EmailService, EmailTemplate } from './email.service';

@Injectable()
export class EventService implements EventBroadcasterInterface {
  private logger = new Logger(EventService.name);
  constructor(
    @InjectRepository(EventEntity)
    private flowEventRepository: Repository<EventEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private emailService: EmailService,
  ) {}

  async broadcastEvents(
    blockHeight: number,
    events: FlowEvent[],
  ): Promise<void> {
    if (events.length > 0) {
      this.logger.debug(`Received events:`, events);
    }
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
      this.logger.error(`Error processing donation events: ${e}`);
    }
  }

  private async processRegistrationEvents(events: FlowEvent[]) {
    try {
      const users = await this.userRepository.save(
        events.map(
          (event) =>
            ({
              createdAt: event.blockTimestamp,
              ...event.data,
            } as UserEntity),
        ),
      );
      await Promise.allSettled(
        users.map((user) => {
          if (!user.email) {
            this.logger.debug(`Email not found for: ${user.address}`);
            return;
          }
          this.emailService.send<EmailTemplate.WELCOME>({
            template: EmailTemplate.WELCOME,
            templateData: { name: user.name },
            to: user.email,
          });
        }),
      );
    } catch (e) {
      this.logger.error(`Error processing registration events: ${e}`);
    }
  }

  destroy(): Promise<void> {
    return Promise.resolve(undefined);
  }
}
