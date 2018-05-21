import { Customer } from '../../domain/customer';

export interface ICustomerRepository {

    AddCustomer(customer: Customer): Promise<Customer>;

    UpdateCustomer(id: string, customer: Customer): Promise<Customer>;

    DeleteCustomer(id: String): Promise<Customer>;

}