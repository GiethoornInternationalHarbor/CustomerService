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

  public async getCustomer(id: string) {    
    const customer = await this.Model.findById(id);
  }

  public async AddCustomer(customer: Customer): Promise<Customer> {
    const createdModel = await this.Model.create(customer);

    const createdCustomer = mapModelToEntity<ICustomerDocument, Customer>(
      createdModel,
      Customer
    );

    return createdCustomer;
  }

  public async UpdateCustomer(id: string, customer: Customer): Promise<Customer> {
   const updatedModel = await this.Model.findByIdAndUpdate(id, customer, { new: true });
   
   console.log(id);
   

    if (!updatedModel) {
      throw new Error('Customer not found');
    }

    const updatedCustomer = mapModelToEntity<ICustomerDocument, Customer>(updatedModel, Customer);

    return updatedCustomer;
  }

  public async exists(id: string): Promise<boolean> {
    return (await this.Model.count({ Id: id })) > 0;
  }

  public async DeleteCustomer(id: String): Promise<Customer> {
    const foundModel = await this.Model.findOneAndRemove({Id: id});

    if (!foundModel) {
      // This should never ever happen
      throw new Error('Customer not found');
    }

    const deletedCustomer = mapModelToEntity<ICustomerDocument, Customer>(foundModel, Customer);

    return deletedCustomer;
  }
}
