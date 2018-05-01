import { IUserDocument } from '../model/schemas/user.schema';
import { User } from '../model/user.model';

export class UserService {

    /**
     * Gets a list of users
     * @returns All users from the Mongo database.
     */
    public static async getusers() {
        return await User.find({});
    }

    /**
     * Gets an user of the ID
     * @param id The Object ID to search by.
     * @returns A single user.
     */
    public static async getUser(id: string) {
        return await User.findById(id);
    }

    /**
     * Create a new accomodation
     * @param accomodation the accomodation object.
     * @returns A new user.
     */
    public static async addUser(user: IUserDocument) {
        return await User.create(user);
    }

    /**
     * Updates a single user.
     * @param id The ID of the user to update.
     * @param user The new values for the user.
     */
    public static async updateUser(id: string, user: IUserDocument) {
        return await User.findByIdAndUpdate(id, user, { new: true });
    }

    /**
     * Deletes an user of the ID
     * @param id The Object ID to delete.
     */
    public static async deleteUser(id) {
        const user = await this.getUser(id);
        return await User.findByIdAndRemove(id);
    }
}
