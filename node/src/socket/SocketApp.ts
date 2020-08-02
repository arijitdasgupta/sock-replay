import websocket from "ws"
import { Metrics } from "../metrics/Metrics";
import prom from "prom-client"
import Logger from "bunyan"

export class SocketApp {
    private socketGauge: prom.Gauge<string>
    private socketError: prom.Counter<string>
    private className = "SocketApp"

    constructor(private socketServer: websocket.Server, private metrics: Metrics, private logger: Logger) {
        this.socketGauge = metrics.getGauge("socket_connections_active", "Number of active socket connections")
        this.socketError = metrics.getCounter("socket_connections_error", "Number of active socket connections")
        this.logger = logger.child({class: this.className})

        this.initiateApplication()
    }

    private initiateApplication() {
        this.socketServer.on("connection", (socket: websocket) => {
            this.logger.debug("Socket connected")
            this.socketGauge.inc()

            socket.on("message", (data) => {
                this.logger.debug(JSON.stringify(JSON.parse(data.toString('utf-8'))))
            })
        })

        this.socketServer.on("headers", (headers) => {
            this.logger.debug(`Recieved headers: ${headers.join(" ")}`)
        })

        this.socketServer.on("close", () => {
            this.logger.debug("Socket disconnected")
            this.socketGauge.dec()
        })

        this.socketServer.on("error", (socket: websocket) => {
            this.logger.debug("Socket error")
            this.socketError.inc()
        })
    }
}