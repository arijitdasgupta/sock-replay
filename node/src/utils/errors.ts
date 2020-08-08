import { SessionId } from "../../../common/lib/messages"

export enum ErrorTypes {
    SESSION_NOT_FOUND
}

export interface CustomErrors extends Error {
    errorType: ErrorTypes
}

export class SocketSessionNotFound extends Error implements CustomErrors {
    public errorType: ErrorTypes

    constructor(sessionId: SessionId) {
        super(`Session: ${sessionId.id} not available`)
        this.errorType = ErrorTypes.SESSION_NOT_FOUND
    }
}

