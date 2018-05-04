import { Customer } from '../model/customer.model';
import { ICustomerDocument } from '../model/schemas/customer.schema';

export class CustomerService {

    /**
     * Gets an customer of the ID
     * @param id The Object ID to search by.
     * @returns A single customer.
     */
    public static async getCustomer(id: string) {
        return await Customer.findById(id);
    }

    /**
     * Create a new customer
     * @param customer the customer object.
     * @returns A new customer.
     */
    public static async addCustomer(customer: ICustomerDocument) {
        return await Customer.create(customer);
    }

    /**
     * Updates a single customer.
     * @param id The ID of the customer to update.
     * @param customer The new values for the customer.
     */
    public static async updateCustomer(id: string, customer: ICustomerDocument) {
        return await Customer.findByIdAndUpdate(id, customer, { new: true });
    }

    /**
     * Deletes an customer of the ID
     * @param id The Object ID to delete.
     */
    public static async deleteCustomer(id) {
        const customer = await this.getCustomer(id);
        return await Customer.findByIdAndRemove(id);
    }
}
