import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DonationEntity } from '../entities/donation.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { EmailService, EmailTemplate } from './email.service';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class CronService {
  private logger = new Logger(CronService.name);
  constructor(
    @InjectRepository(DonationEntity)
    private flowEventRepository: Repository<DonationEntity>,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private emailService: EmailService,
  ) {}

  /**
   * Query for recurring transactions that happened 30days ago
   * and send confirmation emails for this month's payments
   */
  @Cron(CronExpression.EVERY_30_SECONDS) // TODO: set longer interval in production
  async processRecurringTxReminders() {
    // TODO: set 30day interval in production
    const secDiffThreshold = 60;
    const donations = await this.flowEventRepository
      .createQueryBuilder('q')
      .select()
      .where('TIME_TO_SEC(TIMEDIFF(q.blockTimestamp, :d)) % :n > 30', {
        d: new Date().toISOString(),
        n: secDiffThreshold,
      })
      .getMany();

    if (donations.length === 0) {
      return;
    }

    this.logger.debug(
      `Processing ${donations.length} donations`,
      JSON.stringify(donations, null, 2),
    );

    const taskResults = await Promise.allSettled(
      donations.map(async (donation) => {
        // TODO: use fromUser data in email template (name, profile url,...)
        const [fromUser, toUser] = await Promise.all([
          this.userRepository.findOneBy({ address: donation.from }),
          this.userRepository.findOneBy({ address: donation.to }),
        ]);
        if (!toUser.email) {
          return Promise.reject(
            `Receiving user ${toUser.address} has no email!`,
          );
        }
        return this.emailService.send<EmailTemplate.RECURRING_TX_REMINDER>({
          template: EmailTemplate.RECURRING_TX_REMINDER,
          to: toUser.email,
          templateData: {
            transactionDate: new Date().toISOString(),
            flowAmount: donation.amount,
            receiverAddress: donation.to,
          },
        });
      }),
    );

    this.postProcessing(taskResults);
  }

  private postProcessing(taskResults) {
    const rejectedTasks = taskResults.filter(
      (task) => task.status === 'rejected',
    );
    const numOfSucceeded = taskResults.length - rejectedTasks.length;
    this.logger.debug(
      `Task processing success: ${numOfSucceeded} / ${taskResults.length}`,
    );
  }
}
