import { promisify } from 'util'

import { Config } from "../config/Config"
import Logger from "bunyan"
import { RedisClient } from "redis"
import { SessionId, InitialMessage, ForwardMessage, parseMessage } from "../../../common/lib/messages"

export class MessagesRepository {
    constructor(private config: Config, private logger: Logger, private redisClient: RedisClient) {}

    private getKey = (sessionId: SessionId): string => {
        return `${this.config.messagesNamespace}:${sessionId.id}`
    }

    clearSession = (sessionId: SessionId) => {
        return promisify<string, number, number, any>(this.redisClient.ltrim.bind(this.redisClient))
            (this.getKey(sessionId), 0, 0)
    }

    deleteSession = (sessionId: SessionId) => {
        return promisify<string, any>(this.redisClient.del.bind(this.redisClient))
            (this.getKey(sessionId))
    }

    addSession = (sessionId: SessionId) => {
        return promisify<string, string, any>(this.redisClient.rpush.bind(this.redisClient))
            (this.getKey(sessionId), new InitialMessage(sessionId).toJSONString())
        }

    addMessage = (message: ForwardMessage) => {
        return promisify<string, string, any>(this.redisClient.rpush.bind(this.redisClient))
            (this.getKey(message.sessionId), message.toJSONString())
    }

    getQueueLength = (sessionId: SessionId) => {
        return promisify<string, number>(this.redisClient.llen.bind(this.redisClient))(this.getKey(sessionId))
    }

    getMessages = (sessionId: SessionId, horizon: number, end: number) => {
        return promisify<string, number, number, string[]>(this.redisClient.lrange.bind(this.redisClient))
            (this.getKey(sessionId), horizon, end).then((messages) => {
                return messages.map(parseMessage)
            })
    }

    hasSession = async (sessionId: SessionId) => {
        return !!(
            await promisify<string, number>(this.redisClient.llen.bind(this.redisClient))(this.getKey(sessionId))
        )
    }
}