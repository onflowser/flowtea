import { EventBroadcasterInterface } from '@rayvin-flow/flow-scanner-lib/lib/broadcaster/event-broadcaster';
import { FlowEvent } from '@rayvin-flow/flow-scanner-lib/lib/flow/models/flow-event';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEntity } from '../entities/donation.entity';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { EmailService, EmailTemplate } from './email.service';

@Injectable()
export class EventBroadcasterService implements EventBroadcasterInterface {
  private logger = new Logger(EventBroadcasterService.name);
  constructor(
    @InjectRepository(DonationEntity)
    private flowEventRepository: Repository<DonationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private emailService: EmailService,
  ) {}

  async broadcastEvents(
    blockHeight: number,
    events: FlowEvent[],
  ): Promise<void> {
    const registrationEvents = [];
    const donationEvents = [];
    for (const event of events) {
      if (event.type.match(/FlowTea\.Donation/)) {
        donationEvents.push(event);
      }
      if (event.type.match(/FlowTea\.Registration/)) {
        registrationEvents.push(event);
      }
    }
    if (registrationEvents.length > 0) {
      this.logger.debug(
        `Received ${registrationEvents.length} registration events`,
        JSON.stringify(registrationEvents, null, 2),
      );
      await this.processRegistrationEvents(registrationEvents);
    }
    if (donationEvents.length > 0) {
      this.logger.debug(
        `Received ${donationEvents.length} donation events`,
        JSON.stringify(donationEvents, null, 2),
      );
      await this.processDonationEvents(donationEvents);
    }
  }

  private async processDonationEvents(events: FlowEvent[]) {
    try {
      const donations = await this.flowEventRepository.save(
        events.map(
          (event) =>
            ({
              id: `${event.blockHeight}.${event.transactionId}.${event.eventIndex}`,
              ...event,
              ...event.data,
            } as unknown as DonationEntity),
        ),
      );
      await Promise.allSettled(
        donations.map(async (event) => {
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

  private async processRegistrationEvents(events: FlowEvent[]) {
    try {
      await this.userRepository.upsert(
        events.map(
          (event) =>
            ({
              createdAt: event.blockTimestamp,
              ...event.data,
            } as UserEntity),
        ),
        { conflictPaths: ['address'] },
      );
      const users = await this.userRepository
        .createQueryBuilder('user')
        .where('user.address IN (:...addresses)', {
          addresses: events.map((e) => e.data.address),
        })
        .getMany();
      await Promise.allSettled(
        users.map(async (user) => {
          if (!user.email) {
            this.logger.debug(`Email not found for: ${user.address}`);
            return;
          }
          await this.emailService.send<EmailTemplate.WELCOME>({
            template: EmailTemplate.WELCOME,
            templateData: { name: user.name },
            to: user.email,
          });
          await this.userRepository.update(user.address, {
            isWelcomeEmailSent: true,
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
