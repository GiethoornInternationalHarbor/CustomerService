import { inject, injectable, postConstruct } from 'inversify';
import { TYPES } from '../../di/types';
import { Customer } from '../../domain/customer';
import { ICustomerService } from '../../application/service/ICustomer.service';
import { MessageHandlerProvider } from '../di/di.config';
import { IMessageHandler } from '../messaging/imessage.handler';
import { MessageType } from '../messaging/message.types';
import { RabbitMQExchange } from '../rabbitmq/rabbitmq.exchanges';
import { RabbitMQQueue } from '../rabbitmq/rabbitmq.queues';

@injectable()
export class MessageBrokerHandlerCustomerService {
  private messageHandler: IMessageHandler;
  constructor(
    @inject(TYPES.MessageHandlerProvider)
    private messageHandlerProvider: MessageHandlerProvider,
    @inject(TYPES.ICustomerService) private customerService: ICustomerService
  ) {}

  @postConstruct()
  public async postInit() {
    this.messageHandler = await this.messageHandlerProvider(RabbitMQExchange.Default, RabbitMQQueue.Default);

    console.log('Starting message handling, (handling outstanding events)');
    await this.messageHandler.start(this.handleMessage.bind(this));
    console.log('Message handling started, (new events)');
  }

  private async handleMessage(type: MessageType, body?: any) {
    if (!body) {
      // We cant handle anything without a body
      throw new Error(
        `Expected body for message type: ${MessageType.toString(type)}`
      );
    }

    switch (type) {
      case MessageType.CustomerCreated:
        await this.handleCustomerCreated(body);
        break;
      case MessageType.CustomerUpdated: {
        await this.handleCustomerUpdated(body);
        break;
      }
      case MessageType.CustomerDeleted: {
        await this.handleCustomerDeleted(body);
      }
    }
  }

  private async handleCustomerCreated(body: any) {
    const customer = new Customer(body);

    return this.customerService.add(customer);
  }

  private async handleCustomerUpdated(body?: any) {
    const customer = new Customer(body);

    return this.customerService.update(customer);
  }

  private async handleCustomerDeleted(body: any) {
    const customer = new Customer(body);

    return this.customerService.delete(customer._id);
  }
}
