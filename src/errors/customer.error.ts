export class CustomerError extends Error {

    /**
     * Initializes the CustomerError instance
     * @param message The message of the error
     */
    constructor(message?: string) {
        super(message);
    }
}
