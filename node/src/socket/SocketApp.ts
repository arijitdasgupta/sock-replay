import prom from "prom-client"
import Logger from "bunyan"
import http from "http"
import socketio from "socket.io"
import express from "express"

import { Metrics } from "../metrics/Metrics";
import { Config } from "../config/Config"
import { SocketSessionManagerSingleton } from "../lib/SocketSessionManagerSingleton"

export class SocketApp {
    private className = "SocketApp"

    constructor(private config: Config, private logger: Logger, private sessionManager: SocketSessionManagerSingleton) {
        this.logger = logger.child({class: this.className})
    }

    public async run() {
        const app = express()
        const server = http.createServer(app)
        const io = socketio(server)

        io.on("connection", (socket) => {
            this.logger.debug("Socket connected")
            this.sessionManager.attach(socket)
        })

        return new Promise((resolve, reject) => {
            try {
                server.listen(this.config.socketPort, () => {
                    this.logger.info(`Socket listening on ${this.config.socketPort}`)
                    resolve()
                })
            } catch(e) {
                reject(e)
            }
        })
    }
}