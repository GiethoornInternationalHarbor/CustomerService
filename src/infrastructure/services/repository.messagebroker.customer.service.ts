import { inject, injectable, postConstruct } from 'inversify';
import { TYPES } from '../../di/types';
import { Customer } from '../../domain/customer';
import { ICustomerService } from '../../application/service/ICustomer.service'
import { MessagePublisherProvider } from '../di/di.config';
import { IMessagePublisher } from '../messaging/imessage.publisher';
import { MessageType } from '../messaging/message.types';
import { RabbitMQExchange } from '../rabbitmq/rabbitmq.exchanges';
import { CustomerRepositoryProvider} from '../di/di.config';

@injectable()
export class RepositoryAndMessageBrokerCustomerService implements ICustomerService {
  constructor(
    @inject(TYPES.CustomerRepositoryProvider)
    private readonly customerRepositoryProvider: CustomerRepositoryProvider,
    @inject(TYPES.MessagePublisherProvider)
    private messagePublisherProvider: MessagePublisherProvider
  ) {}

  public async add(customer: Customer): Promise<Customer> {
    const customerRepo = await this.getCustomerRepository();

    // Save it in the repository, since we are sure it is valid now
    const createdCustomer = await customerRepo.addCustomer(customer);

    // Now publish it as an message
    const messagePublisher = await this.getMessagePublisher();
    await messagePublisher.publishMessage(MessageType.CustomerCreated, createdCustomer);

    return createdCustomer;
  }

  public async update(customer: Customer): Promise<Customer> {

    const customerRepo = await this.getCustomerRepository();

    const updatedCustomer = await customerRepo.updateCustomer(customer._id, customer);

    const messagePublisher = await this.getMessagePublisher();
    await messagePublisher.publishMessage(MessageType.CustomerUpdated, updatedCustomer);

    return updatedCustomer;
  }

  public async delete(id): Promise<Customer> {
    const customerRepo = await this.getCustomerRepository();

    const deletedCustomer = await customerRepo.deleteCustomer(id);

    const messagePublisher = await this.getMessagePublisher();
    await messagePublisher.publishMessage(MessageType.CustomerDeleted, deletedCustomer);

    return deletedCustomer;
  }


  /**
   * Gets the customer repository
   */
  private async getCustomerRepository() {
    return this.customerRepositoryProvider();
  }

  /**
   * Gets the message publisher
   */
  private async getMessagePublisher() {
    return this.messagePublisherProvider(RabbitMQExchange.Default);
  }
}
