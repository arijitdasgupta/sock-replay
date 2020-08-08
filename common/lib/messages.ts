export class ParsingError extends Error {}

export class SessionId {
    constructor(public id: string) {}
}

export enum MessageType {
    INITIAL,
    MESSAGE,
    NULL
}

export interface Message {
    messageType: MessageType
    sessionId: null | SessionId
    payload: null | string;
    toJSONString: () => string;
}

export class NullMessage implements Message {
    public messageType = MessageType.NULL
    public payload: null = null
    public sessionId: null = null

    toJSONString = () => JSON.stringify({
        t: this.messageType.valueOf(),
        s: null,
        p: null
    })
}

export class InitialMessage implements Message {
    public messageType = MessageType.INITIAL
    public payload: null = null
    
    constructor(public sessionId: SessionId) {}

    toJSONString = () => {
        return JSON.stringify({
            t: this.messageType.valueOf(),
            s: this.sessionId.id,
            p: null
        })
    }
}

export class ForwardMessage implements Message {
    public messageType = MessageType.MESSAGE

    constructor(public sessionId: SessionId, public payload: string) {}

    toJSONString = () => {
        return JSON.stringify({
            t: this.messageType.valueOf(),
            s: this.sessionId.id,
            p: this.payload
        })
    }
}

export const parseMessage = (message: string): Message => {
    const parsed = JSON.parse(message)
    const messageType = parsed.t
    const messagePayload = parsed.p
    const sessionId = parsed.s

    switch (messageType) {
        case MessageType.INITIAL.valueOf():
            return new InitialMessage(new SessionId(sessionId))
        case MessageType.MESSAGE.valueOf():
            return new ForwardMessage(new SessionId(sessionId), messagePayload)
        case MessageType.NULL.valueOf():
            return new NullMessage()
        default:
            throw new ParsingError()
    }
}