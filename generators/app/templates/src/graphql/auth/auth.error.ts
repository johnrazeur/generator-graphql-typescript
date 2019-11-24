import { MyError } from "../../utils/error";

export class InvalidEmailOrPasswordError extends MyError {
    constructor() {
        const message = "invalid email or password";
        super(message);
    }
}

export class EmailAlreadyUseError extends MyError {
    constructor() {
        const message = "email already use";
        super(message);
    }
};

export class UsernameAlreadyUseError extends MyError {
    constructor() {
        const message = "username already use";
        super(message);
    }
};