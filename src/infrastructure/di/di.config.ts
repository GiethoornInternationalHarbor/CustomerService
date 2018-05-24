import { ContainerModule } from 'inversify';
import { ICustomerService } from '../../application/service/ICustomer.service';
import { TYPES } from '../../di/types';
import { IMessageHandler } from '../messaging/imessage.handler';
import { IMessagePublisher } from '../messaging/imessage.publisher';
import { ICustomerRepository } from '../repository/icustomerRepository';
import { getDatabaseClient } from '../mongodb/mongodb.client';
import { MongoDbCustomerRepository } from '../mongodb/mongodb.customer.repository';
import { getRabbitMQChannel } from '../rabbitmq/rabbitmq.channel';
import { RabbitMQMessageHandler } from '../rabbitmq/rabbitmq.message.handler';
import { RabbitMQMessagePublisher } from '../rabbitmq/rabbitmq.message.publisher';
import { MessageBrokerHandlerCustomerService } from '../services/messagebroker.handler.customer.service';
import { RepositoryAndMessageBrokerCustomerService } from '../services/repository.messagebroker.customer.service';


/**
 * Provider for the IMessagePublisher interface
 */
export type MessagePublisherProvider = (exchange: string) => Promise<IMessagePublisher>;

/**
 * Provider for the IMessageHandler interface
 */
export type MessageHandlerProvider = (exchange: string, queue: string) => Promise<IMessageHandler>;

/**
 * Provider for the ITruckRepository interface
 */
export type CustomerRepositoryProvider = () => Promise<ICustomerRepository>;

export const InfrastructureContainerModule = new ContainerModule(bind => {
    bind<MessagePublisherProvider>(TYPES.MessagePublisherProvider).toProvider<IMessagePublisher>(context => {
      return async (exchange: string) => {
        const channel = await getRabbitMQChannel();
  
        // We have the connection and channel now
        // Need to assert the exchange (this ensures the exchange exists)
        await channel.assertExchange(exchange, 'fanout', {
          durable: true,
          autoDelete: false
        });
  
        const publisher = new RabbitMQMessagePublisher(exchange, channel);
        return publisher;
      };
    });
  
    bind<MessageHandlerProvider>(TYPES.MessageHandlerProvider).toProvider<IMessageHandler>(context => {
      return async (exchange: string, queue: string) => {
        const channel = await getRabbitMQChannel();
  
        // We have the connection and channel now
        // Need to assert the exchange (this ensures the exchange exists)
        await channel.assertExchange(exchange, 'fanout', {
          durable: true,
          autoDelete: false
        });
  
        await channel.assertQueue(queue);
        await channel.bindQueue(queue, exchange, '');
  
        const handler = new RabbitMQMessageHandler(queue, channel);
        return handler;
      };
    });


    bind<CustomerRepositoryProvider>(TYPES.CustomerRepositoryProvider).toProvider<ICustomerRepository>(context => {
        return async () => {
        const dbClient = await getDatabaseClient();

        return new MongoDbCustomerRepository(dbClient);
        };
    });

    bind<ICustomerService>(TYPES.ICustomerService).to(RepositoryAndMessageBrokerCustomerService);

    bind(TYPES.MessageHandler).to(MessageBrokerHandlerCustomerService).inSingletonScope();
});

export async function checkInfrastructureInitialization() {
    return Promise.all([getDatabaseClient(), getRabbitMQChannel()]);
  }
