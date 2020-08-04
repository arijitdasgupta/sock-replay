import mongo from "mongodb"
import { Config } from "../config/Config"

export class SessionRepository {
    public mongoSessionCollection: mongo.Collection

    constructor(private mongoDb: mongo.Db, private config: Config) {
        this.mongoSessionCollection = mongoDb.collection(config.sessionsCollectionName)
    }

    updateCounter(sessionId: string, counter: number) {
        return this.mongoDb.collection(this.config.sessionsCollectionName).findOneAndUpdate({ sessionId }, { $set: { counter } })
    }

    findBySessionId(sessionId: string) {
       return this.mongoDb.collection(this.config.sessionsCollectionName).findOne({sessionId: sessionId})
    }

    pushSession(sessionId: string) {
        return this.mongoSessionCollection.insertOne({
            sessionId: sessionId,
            counter: 0
        })
    }
}