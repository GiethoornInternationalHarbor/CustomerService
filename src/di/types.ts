const TYPES = {
    App: Symbol.for('APP'),
    ICustomerService: Symbol.for('ICustomerService'),
    CustomerRepositoryProvider: Symbol.for('CustomerRepositoryProvider'),
    MessagePublisherProvider: Symbol.for("MessagePublisherProvider"),
    MessageHandlerProvider: Symbol.for("MessageHandlerProvider"),
    RabbitMQChannel: Symbol.for("RabbitMQChannel"),
    MessageHandler: Symbol.for("MessageHandler")
  };

export { TYPES };
