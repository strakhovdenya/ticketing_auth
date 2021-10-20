import {CustomError} from "./custom-error";

export class DatabaseConnectionError extends CustomError {
    reason  = 'Error connecting to DB';
    statusCode = 500;

    constructor() {
        super('');

        // Only because we are extending a built in class
        Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
    }

    serializeError(){
        return [
            {message: this.reason}
        ];
    }
}

