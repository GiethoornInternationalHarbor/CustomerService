export class UserError extends Error {

    /**
     * Initializes the UserError instance
     * @param message The message of the error
     */
    constructor(message?: string) {
        super(message);
    }
}
