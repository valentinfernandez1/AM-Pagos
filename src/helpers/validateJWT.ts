import axios from "axios";
import { NextFunction, Request, Response } from "express";
import cacheUtils from "../utils/cacheUtils";

require("dotenv").config();

const AUTH_URL = process.env.AUTH_URL;

const validateJWT = async (req: Request, res: Response, next: NextFunction) => {
  const authorization = req.header("Authorization");
  const userId = req.params.id;

  if (userId == undefined || userId == null) {
    return res.status(400).json({
      msg: "Must include userId in http path",
    });
  }

  if (!authorization) {
    return res.status(401).json({
      msg: "authorization header empty, must include token",
    });
  }

  try {
    const storeToken = await cacheUtils.getValue(authorization);

    if (!storeToken) {
      const auth = await axios.get(`${AUTH_URL}/v1/users/current`, {
        headers: { Authorization: authorization },
      });

      if (auth.status != 200) {
        throw new Error("Token not found in auth service");
      }

      cacheUtils.storeValue(userId, authorization);
    }

    next();
  } catch (error) {
    return res.status(401).json({
      msg: "Invalid token",
    });
  }
};

export default validateJWT;
