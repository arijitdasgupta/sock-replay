import mongo from "mongodb"

import { SessionNotFound } from "../utils/errors"
import { MessagesRepository } from "../db/MessagesRepository"
import { ForwardMessage, SessionId } from "../../../common/lib/messages"

export class PushService {
    constructor(private messagesRepo: MessagesRepository) {}

    async pushToSession(sessionId: SessionId, data: string) {
        return this.messagesRepo.addMessage(new ForwardMessage(
            sessionId,
            data
        ))
    }

    async deleteSession(sessiondId: SessionId) {
        return this.messagesRepo.deleteSession(sessiondId)
    }

    async clearSession(sessiondId: SessionId) {
        return this.messagesRepo.clearSession(sessiondId)
    }
}