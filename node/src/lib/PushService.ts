import mongo from "mongodb"

import { MessagesRepository } from "../db/MessagesRepository"
import { ForwardMessage, SessionId } from "../../../common/lib/messages"
import { SocketSessionManagerSingleton } from "./SocketSessionManagerSingleton"

export class PushService {
    constructor(private messagesRepo: MessagesRepository, private socketManager: SocketSessionManagerSingleton) {}

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
        this.socketManager.resetHorizon(sessiondId)
        return this.messagesRepo.clearSession(sessiondId)
    }
}