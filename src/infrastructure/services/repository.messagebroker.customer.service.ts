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
    const createdCustomer = await customerRepo.AddCustomer(customer);


    // Now publish it as an message
    const messagePublisher = await this.getMessagePublisher();
    await messagePublisher.publishMessage(MessageType.CustomerCreated, createdCustomer);

    return createdCustomer;
  }

  public async update(customer: Customer): Promise<Customer> {

    const customerRepo = await this.getCustomerRepository();

    const UpdatedCustomer = await customerRepo.UpdateCustomer(customer._id, customer);

    const messagePublisher = await this.getMessagePublisher();
    await messagePublisher.publishMessage(MessageType.CustomerUpdated, UpdatedCustomer);

    return UpdatedCustomer;
  }

  public async delete(id): Promise<Customer> {
    const customerRepo = await this.getCustomerRepository();

    const DeletedCustomer = await customerRepo.DeleteCustomer(id);

    const messagePublisher = await this.getMessagePublisher();
    await messagePublisher.publishMessage(MessageType.CustomerDeleted, DeletedCustomer);

    return DeletedCustomer;
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
    const t = await this.messagePublisherProvider(RabbitMQExchange.Default);
    return t;
  }
}