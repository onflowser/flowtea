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

  private async processDonationEvents(flowEvents: FlowEvent[]) {
    try {
      const events = await this.flowEventRepository.save(
        flowEvents.map(
          (event) =>
            ({
              id: `${event.blockHeight}.${event.transactionId}.${event.eventIndex}`,
              ...event,
              ...event.data,
            } as unknown as EventEntity),
        ),
      );
      await Promise.allSettled(
        events.map(async (event) => {
          const [receiver, sender] = await Promise.all([
            this.userRepository.findOneBy({
              address: event.to,
            }),
            this.userRepository.findOneBy({
              address: event.from,
            }),
          ]);

          const futures = [];
          if (receiver.email) {
            futures.push(
              this.emailService.send<EmailTemplate.TX_RECEIVED>({
                template: EmailTemplate.TX_RECEIVED,
                templateData: { flowAmount: event.amount },
                to: receiver.email,
              }),
            );
          } else {
            this.logger.debug(
              `Email not found for receiver: ${receiver.address}`,
            );
          }
          if (sender.email) {
            futures.push(
              this.emailService.send<EmailTemplate.TX_SENT>({
                template: EmailTemplate.TX_SENT,
                templateData: {
                  flowAmount: event.amount,
                  receiverAddress: receiver.address,
                },
                to: sender.email,
              }),
            );
          } else {
            this.logger.debug(
              `Email not found for sender: ${receiver.address}`,
            );
          }

          return Promise.allSettled(futures);
        }),
      );
    } catch (e) {
      this.logger.error(`Error processing donation events: ${e}`);
    }
  }

  private async processRegistrationEvents(flowEvents: FlowEvent[]) {
    try {
      const users = await this.userRepository.save(
        flowEvents.map(
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
          return this.emailService.send<EmailTemplate.WELCOME>({
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
