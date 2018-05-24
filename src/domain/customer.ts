import { BasicModel, Model } from 'objectmodel';
import { v4 as uuid } from 'uuid';

export class Customer extends Model({
  id: String,
  name: String,
  email: String
}) {}

Customer.defaults({
  id: uuid()
});
