export class Config {
    public dbUrl: string;
    public httpPort: number;
    public serviceName: string;

    constructor(env: any) {
        this.dbUrl = env.DB_URL
        this.serviceName = env.SERVICE_NAME || "sock-replay"

        if (isNaN(parseInt(env.HTTP_PORT))) {
            throw new Error("Invalid HTTP_PORT")
        } else {
            this.httpPort = env.HTTP_PORT
        }
    } 
}