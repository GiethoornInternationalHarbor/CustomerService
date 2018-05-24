import { Customer } from '../../domain/customer';

export interface ICustomerRepository {
  /**
   * Gets all the customers
   */
  getAll(): Promise<Customer[]>;

  addCustomer(customer: Customer): Promise<Customer>;

  updateCustomer(id: string, customer: Customer): Promise<Customer>;

  deleteCustomer(id: string): Promise<Customer>;
}
