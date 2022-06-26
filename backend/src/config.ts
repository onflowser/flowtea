import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type NodeEnvironment = 'development' | 'staging' | 'production';
export type FlowConfig = {
  accessNode: string;
  deploymentAccountAddress: string;
};
export type EmailConfig = {
  enableSendingEmail: boolean;
  sendgridApiKey: string;
};

type Config = {
  database: TypeOrmModuleOptions;
  flow: FlowConfig;
  email: EmailConfig;
  environment: NodeEnvironment;
};

const database: TypeOrmModuleOptions = {
  type: (process.env.TYPEORM_TYPE as any) || 'mariadb',
  host: (process.env.TYPEORM_HOST as any) || 'localhost',
  port: (process.env.TYPEORM_PORT as any) || 3306,
  username: (process.env.TYPEORM_USERNAME as any) || '',
  password: (process.env.TYPEORM_PASSWORD as any) || '',
  database: (process.env.TYPEORM_DATABASE as any) || 'test',
  synchronize: process.env.NODE_ENV !== 'production',
};

const flow: FlowConfig = {
  accessNode: process.env.FLOW_ACCESS_NODE || getAccessNodeApi(),
  deploymentAccountAddress:
    (process.env.FLOW_DEPLOYMENT_ACCOUNT_ADDRESS as any) ||
    '0xf8d6e0586b0a20c7',
};

const email = {
  enableSendingEmail: (process.env.EMAIL_ENABLE_SENDING as any) === 'true',
  sendgridApiKey: process.env.EMAIL_SENDGRID_API_KEY as any,
};

const environment = (process.env.NODE_ENV as any) || 'development';

export const config: Config = {
  database,
  flow,
  email,
  environment,
};

if (!config.flow.deploymentAccountAddress) {
  console.log('FLOW_DEPLOYMENT_ACCOUNT_ADDRESS env variable must be set!');
  process.exit(1);
}

function getAccessNodeApi() {
  switch (environment) {
    case 'production':
      return 'https://rest-mainnet.onflow.org/v1';
    case 'staging':
      return 'https://rest-testnet.onflow.org/v1';
    case 'development':
      return 'http://localhost:8080';
  }
}