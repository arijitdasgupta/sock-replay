import mongo from "mongodb"
import { Config } from "../config/Config"
import Logger from "bunyan"

export class MessagesRepository {
    private mongoMessagesCollection: mongo.Collection

    constructor(private mongoDb: mongo.Db, private config: Config, private logger: Logger) {
        this.mongoMessagesCollection = mongoDb.collection(config.messagesCollectionName)
    }

    findBySessionId = (sessionId: string) => {
        return this.mongoMessagesCollection.findOne({
            sessionId
        })
    }

    addSession = (sessionId: string) => {
        return this.mongoMessagesCollection.insertOne({sessionId, counter: 0})
    }

    addToMessages = (sessionId: string, sequenceNumber: number, message: any) => {
        return this.mongoMessagesCollection.insertOne({
            sessionId,
            sequenceNumber,
            message
        })
    }

    attachStreamingCursor = (callback: (sessionId: string, message: string) => void) => {
        return this.mongoDb.collection(this.config.messagesCollectionName).watch({}).on("change", (next) => {
            if (next.operationType === 'insert') {
                this.logger.debug(next.fullDocument)
                callback(next.fullDocument.sessionId, next.fullDocument.message)
            }
        })
    }
}