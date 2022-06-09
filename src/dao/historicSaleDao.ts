import { Date, Int, NVarChar } from 'mssql';
import db from '../utils/db';

export interface User {
  idUser: number,
  name: string,
  lastname: string
}

export default class UserDao {

  static async saveUser(user: User) {
    const connection = await db();
    const request = connection.request();

    request.input('name', Date, user.name);
    request.input('last_name', Int, user.lastname);

    return request.query('insert into User values(@name, @last_name)');
  }
}
