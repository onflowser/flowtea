import { Injectable, Logger } from '@nestjs/common';
import * as sendGrid from '@sendgrid/mail';

export enum EmailTemplate {
  WELCOME = 'welcome',
}

const emailTemplateToId = {
  [EmailTemplate.WELCOME]: 'd-0c089f8dbf98476f894f9e358df6fa07 ',
};

const emailTemplateToDefaultSubject = {
  [EmailTemplate.WELCOME]: 'Welcome to FlowTea!',
};

type SendEmailArgs<T extends EmailTemplate> = {
  subject?: string;
  template: EmailTemplate;
  to: string;
  templateData: EmailTemplateData[T];
};

type EmailTemplateData = {
  [EmailTemplate.WELCOME]: {
    name: string;
  };
};

@Injectable()
export class EmailService {
  private logger = new Logger(EmailService.name);

  constructor() {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
  }

  send<T extends EmailTemplate>(args: SendEmailArgs<T>) {
    const templateId = emailTemplateToId[args.template];
    if (!templateId) {
      throw new Error('Email template not supported');
    }
    const subject = args.subject
      ? args.subject
      : emailTemplateToDefaultSubject[args.template];

    this.logger.debug(
      `Sending ${args.template} email (to: ${
        args.to
      }, subject: ${subject}, templateData: ${JSON.stringify(
        args.templateData,
      )})`,
    );

    if (process.env.ENABLE_SENDING_EMAIL !== 'true') {
      return;
    }
    return sendGrid.send({
      to: args.to,
      subject,
      replyTo: {
        email: 'support@flowtea.me',
        name: 'FlowTea Support',
      },
      from: 'no-reply@flowtea.me',
      templateId,
      dynamicTemplateData: args.templateData,
    });
  }
}
