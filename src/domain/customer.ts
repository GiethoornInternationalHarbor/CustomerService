import { BasicModel, Model } from 'objectmodel';

export class Customer extends Model({
  name: String,
  email: String,
  password: String
}) {

}
