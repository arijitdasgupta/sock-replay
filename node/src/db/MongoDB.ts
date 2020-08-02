import { MongoClient } from "mongodb"
import Logger from "bunyan"
import { Config } from "../config/Config"

export class MongoDB {
    private url: string
    private logger: Logger

    constructor(config: Config, logger: Logger) {
        this.url = config.dbUrl
        this.logger = logger.child({class: "MognoDB"})
    }

    public async connect() {
        return MongoClient.connect(this.url).then((client) => {
            this.logger.info("Connected to MongoDB")
            return client
        })
    }
}