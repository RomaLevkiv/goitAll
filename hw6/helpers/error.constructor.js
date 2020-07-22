class BaseError extends Error {
    constructor(name, message, status){
        super(message)
        this.name = name
        this.status = status
    }
}

class NotFound extends BaseError {
    constructor(message) {
        super("NotFoundError", message, 404)
    }
}

class DataError extends BaseError {
    constructor(message) {
        super("DataError", message, 500)
    }
}

class EmptyBody extends BaseError {
    constructor(message) {
        super("EmptyBody", message, 400)
    }
}

class ConflictError extends BaseError {
    constructor(message) {
        super("ConflictError", message, 409)
    }
}

class ConflictSubscriptionField extends BaseError {
    constructor(message) {
        super ("ConflictSubscriptionField", message, 409)
    }
}

class UnauthorizedError extends BaseError {
    constructor(message) {
        super ("UnauthorizedError", message, 401)
    }

}

class VerificationError extends BaseError {
    constructor(message) {
        super("VerificationEroor", message, 400)
    }
}

export {
    BaseError, 
    NotFound, 
    DataError, 
    EmptyBody,
    ConflictError,
    ConflictSubscriptionField,
    UnauthorizedError,
    VerificationError
}