import { Customer } from '../../domain/customer';

export interface ICustomerService {

  /**
   * Handles adding customer
   * @param body The incoming data
   */
  add(body: any): Promise<Customer>;

  /**
   * Handles updating customer
   * @param body The incoming data
   */
  update(body: any): Promise<Customer>;

  /**
   * Handles an deleted customer
   * @param id The id of a customer
   */
  delete(id: string): Promise<Customer>;


}