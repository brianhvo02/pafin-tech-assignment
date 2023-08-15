export class ServerError extends Error {
    errors: string[];
    statusCode: number = 500;

    constructor(message: string, errors: string[]) {
        super(message)
        this.errors = errors;
    }
}

export class UnprocessableContent extends ServerError {
    statusCode: number = 422;

    constructor(errors: string[]) {
        super('Unprocessable Content', errors);
    }
}

export class Unauthorized extends ServerError {
    statusCode: number = 401;

    constructor(errors: string[]) {
        super('Unauthorized', errors);
    }
}