import redis, { RedisClient } from "redis"

import { Config } from "../config/Config"
import Logger from "bunyan"

export class Redis {
    public client: RedisClient
    private className = "Redis"

    constructor(private config: Config, private logger: Logger) {
        this.client = redis.createClient({
            host: config.redisHost,
            port: config.redisPort
        })
        this.logger = this.logger.child({class: this.className})
        this.logger.info("Connected to Redis")
    }
}