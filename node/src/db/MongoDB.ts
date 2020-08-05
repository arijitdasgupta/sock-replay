import { MongoClient } from "mongodb"
import Logger from "bunyan"
import { Config } from "../config/Config"

export class MongoDB {
    private url: string

    constructor(private config: Config, private logger: Logger) {
        this.url = config.dbUrl
        this.logger = logger.child({class: "MognoDB"})
    }

    public async connect() {
        return MongoClient.connect(this.url).then((client) => {
            this.logger.info("Connected to MongoDB")
            const db = client.db(this.config.dbName)
            this.logger.info(`Set Mongo database to ${this.config.dbName}`)
            return db
        })
    }
}