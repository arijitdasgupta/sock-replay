export enum ErrorTypes {
    SESSION_NOT_FOUND
}

export interface CustomErrors extends Error {
    errorType: ErrorTypes
}

export class SessionNotFound extends Error implements CustomErrors {
    public errorType: ErrorTypes

    constructor(sessionId: String) {
        super(`Session: ${sessionId} not available`)
        this.errorType = ErrorTypes.SESSION_NOT_FOUND
    }
}

