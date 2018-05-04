import { Document, Model, model, Schema } from 'mongoose';
import { CustomerSchema, ICustomerDocument } from './schemas/customer.schema';

export interface ICustomerModel extends Model<ICustomerDocument> { }
export const Customer = model<ICustomerDocument, ICustomerModel>('Customer', CustomerSchema);

export default Customer;
