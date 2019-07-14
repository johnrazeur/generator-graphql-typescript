import { getConnectionOptions, createConnection, Connection } from "typeorm";

export async function testConn(): Promise<Connection> {
    const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
    return createConnection({ ...connectionOptions, name: "default" });
}

