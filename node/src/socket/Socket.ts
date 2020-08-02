import websocket from "ws"

import { Config } from "../config/Config"
import Logger from "bunyan"

export class Socket {
    public wss: websocket.Server
    private className = "Socket"

    constructor(private config: Config, private logger: Logger) {
        this.logger = logger.child({class: this.className})
    }

    run() {
        return new Promise<websocket.Server>((resolve, reject) => {
            try {
                this.wss = new websocket.Server({
                    port: this.config.socketPort
                })
                this.logger.info(`Started socket ${this.config.socketPort}`)
                resolve(this.wss)
            } catch(e) {
                reject(e)
            }
        })
    } 
}