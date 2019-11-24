export class MyError extends Error {
    public constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, MyError.prototype);
    }
}
