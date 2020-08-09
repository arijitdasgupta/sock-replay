import { SessionId } from "../../../web/src/lib/messages"

export enum ErrorTypes {
    SOCKET_NOT_FOUND,
    SOCKET_NOT_ATTACHED,
    SESSION_NOT_FOUND
}

export interface CustomErrors extends Error {
    errorType: ErrorTypes
}

export class SessionNotFound extends Error implements CustomErrors {
    public errorType: ErrorTypes

    constructor(sessionId: SessionId) {
        super(`Session ${sessionId.id} not found`)
        this.errorType = ErrorTypes.SESSION_NOT_FOUND
    }
}

export class SocketSessionNotFound extends Error implements CustomErrors {
    public errorType: ErrorTypes

    constructor(sessionId: SessionId) {
        super(`Session ${sessionId.id} socket not available`)
        this.errorType = ErrorTypes.SOCKET_NOT_FOUND
    }
}

export class SocketNotAttached extends Error implements CustomErrors {
    public errorType: ErrorTypes

    constructor() {
        super(`Socket was never attached`)
        this.errorType = ErrorTypes.SOCKET_NOT_ATTACHED
    }
}

