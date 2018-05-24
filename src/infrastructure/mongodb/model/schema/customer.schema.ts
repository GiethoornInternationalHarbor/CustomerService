import { Document, Schema } from 'mongoose';
import { Customer } from '../../../../domain/customer';
import { v4 as uuid } from 'uuid';

export interface ICustomerDocument extends Customer, Document {}

export const CustomerSchema = new Schema({
  _id: { type: String, default: _ => uuid() },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});
