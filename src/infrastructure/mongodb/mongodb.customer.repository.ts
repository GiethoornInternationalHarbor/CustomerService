import { inject, injectable } from 'inversify';
import { Model, Schema } from 'mongoose';
import { TYPES } from '../../di/types';
import { Customer } from '../../domain/customer';
import { ICustomerRepository } from '../repository/icustomerRepository';
import { mapModelToEntity } from './helpers/mapper.helper';
import { ICustomerDocument, CustomerSchema } from './model/schema/customer.schema';
import { MongoDbClient } from './mongodb.client';

@injectable()
export class MongoDbCustomerRepository implements ICustomerRepository {
  protected Model: Model<ICustomerDocument>;

  constructor(dbClient: MongoDbClient) {
    this.Model = dbClient.model<ICustomerDocument>('Customer', CustomerSchema);
  }

  public async addCustomer(customer: Customer): Promise<Customer> {
    const createdModel = await this.Model.create(customer);

    const createdCustomer = mapModelToEntity<ICustomerDocument, Customer>(createdModel, Customer);

    return createdCustomer;
  }

  public async updateCustomer(id: string, customer: Customer): Promise<Customer> {
   const getCustomer = await this.Model.findOneAndUpdate(id, customer, { new: true });
  
    if (getCustomer === null) {
      throw new Error('Customer not found');
    }

    const updatedCustomer = mapModelToEntity<ICustomerDocument, Customer>(getCustomer, Customer);

    return updatedCustomer;
  }

  public async deleteCustomer(id: string): Promise<Customer> {
    const getCustomer = await this.Model.findOneAndRemove(id);

    if (getCustomer === null) {
      throw new Error('Customer not found');
    }

    const deletedCustomer = mapModelToEntity<ICustomerDocument, Customer>(getCustomer, Customer);

    return deletedCustomer;
  }
}
