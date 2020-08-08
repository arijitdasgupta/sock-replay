import { Socket } from "socket.io"
import { SessionId } from "../../../common/lib/messages"

export class SocketHorizon {
    constructor(public socket: Socket, public sessionId: SessionId, public horizon: number = 0) {}

    setHorizon = (horizon: number) => {
        return new SocketHorizon(this.socket, this.sessionId, horizon)
    }
}