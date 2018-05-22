import { Customer } from '../../domain/customer';

export interface ICustomerRepository {

    addCustomer(customer: Customer): Promise<Customer>;

    updateCustomer(id: string, customer: Customer): Promise<Customer>;

    deleteCustomer(id: String): Promise<Customer>;

}