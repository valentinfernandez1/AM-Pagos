import UserDao from "dao/historicSaleDao";
import { NextFunction, Request, Response } from "express";

const save = async(req: Request, res: Response, next: NextFunction) => {
  const { name, lastname } = req.body;
  await UserDao.saveUser({name, lastname, idUser: null});
}

export default save;
