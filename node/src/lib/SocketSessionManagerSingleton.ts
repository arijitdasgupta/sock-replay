import socketio from "socket.io"
import Logger from "bunyan"
import { v4 as uuidv4 } from "uuid";

export class SocketSessionManagerSingleton {
    private socketMap: Map<string, socketio.Socket>

    constructor(private logger: Logger) {
        this.socketMap = new Map<string, socketio.Socket>()
    }

    doesSessionExist(sessionId: string): boolean {
        return !!this.socketMap.get(sessionId)
    }

    sendToSession(sessionId: string, data: any): void {
        if (this.doesSessionExist(sessionId)) {
            this.socketMap.get(sessionId).emit("msg", data)
        } else {
            throw new Error(`No session found ${sessionId}`)
        }
    }

    attach(socket: socketio.Socket) {
        socket.on("initiate", (data) => {
            if (!!data && !!data.id && this.doesSessionExist(data.id)) {
                this.socketMap.set(data.id, socket)
                const sessionId = data.id
                this.logger.info(`old session connected: ${sessionId}`)
                socket.emit("ack", {id: sessionId})
            } else {   
                const sessionId = uuidv4()
                this.logger.info(`new session connected: ${sessionId}`)
                this.socketMap.set(sessionId, socket)
                socket.emit("ack", {id: sessionId})
            }
        })
    }
}