import {connect, ConnectionPool} from 'mssql'

let connection: Promise<ConnectionPool>;

export const newConnection = async () => connect(process.env.SQLDB);

export default async function mssql() {
    if (connection) return connection;
    connection = newConnection();
    return connection;
}
