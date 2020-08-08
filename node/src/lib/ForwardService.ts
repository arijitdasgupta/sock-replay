import fetch, { Headers } from "node-fetch"

import { Config } from '../config/Config'

import { InitialMessage, ForwardMessage, Message, MessageType, SessionId, DisconnectMessage } from '../../../common/lib/messages'
import Logger from "bunyan"

export class ForwardService {
    private TYPE_HEADER = "X-Sock-Replay-Type"
    private SESSION_ID_HEADER = "X-Sock-Replay-Session-Id"

    private FORWARD = "FORWARD"
    private CONNECTED = "CONNECTED"
    private DISCONNECTED = "DISCONNECTED"

    constructor(private config: Config, private logger: Logger) {}

    private makeRequest = (forwardType: string, message: Message) => {
        if (this.config.webHook.trim() !== '') {
            return fetch(this.config.webHook, {
                method: 'post',
                body: message.payload,
                headers: new Headers(
                    [
                        ['Content-Type', 'application/text'],
                        [this.SESSION_ID_HEADER, message.sessionId.id],
                        [this.TYPE_HEADER, forwardType]
                    ]
                )
            })
        } else {
            this.logger.debug("No webhook is set!")
            return Promise.resolve()
        }
    }

    forward = (message: Message) => {
        if (message instanceof InitialMessage) {
            return this.makeRequest(this.CONNECTED, message)
        } else if(message instanceof ForwardMessage) {
            return this.makeRequest(this.FORWARD, message)
        } else if (message instanceof DisconnectMessage) {
            return this.makeRequest(this.DISCONNECTED, message)
        } else {
            return Promise.resolve()
        }
    }
}