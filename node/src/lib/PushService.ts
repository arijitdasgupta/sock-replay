import mongo from "mongodb"

import { MessagesRepository } from "../db/MessagesRepository"
import { ForwardMessage, SessionId } from "../../../web/src/lib/messages"
import { SocketSessionManagerSingleton } from "./SocketSessionManagerSingleton"
import { SessionNotFound, SocketSessionNotFound } from "../utils/errors"

export class PushService {
    constructor(private messagesRepo: MessagesRepository, private socketManager: SocketSessionManagerSingleton) {}

    async pushToSession(sessionId: SessionId, data: string) {
        if (await this.messagesRepo.hasSession(sessionId)) {
            return this.messagesRepo.addMessage(new ForwardMessage(
                sessionId,
                data
            ))
        } else {
            throw new SessionNotFound(sessionId)
        }
    }

    async deleteSession(sessionId: SessionId) {
        if (await this.messagesRepo.hasSession(sessionId)) {
            this.socketManager.closeSocketBySessionId(sessionId)
            return this.messagesRepo.deleteSession(sessionId)
        } else {
            throw new SessionNotFound(sessionId)
        }
    }

    async clearSession(sessionId: SessionId) {
        if (await this.messagesRepo.hasSession(sessionId)) {
            this.socketManager.resetHorizon(sessionId)
            return this.messagesRepo.clearSession(sessionId)
        } else {
            throw new SessionNotFound(sessionId)
        }
    }
}