import mongo from "mongodb"

import { SessionNotFound } from "../utils/errors"
import { MessagesRepository } from "../db/MessagesRepository"

export class PushService {
    constructor(private messagesRepo: MessagesRepository) {}

    async pushToSession(sessionId: string, data: any) {
        const singleMessage = await this.messagesRepo.findBySessionId(sessionId)
        if (singleMessage) {
            await this.messagesRepo.addToMessages(sessionId, 0, JSON.stringify(data))
        } else {
            throw new SessionNotFound(sessionId)
        }
    }
}