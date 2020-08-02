export class Config {
    public dbUrl: string;
    public httpPort: number;

    constructor(env: any) {
        this.dbUrl = env.DB_URL

        if (isNaN(parseInt(env.HTTP_PORT))) {
            throw new Error("Invalid HTTP_PORT")
        } else {
            this.httpPort = env.HTTP_PORT
        }
    } 
}