import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import { check } from "express-validator";
import validateJWT from "../helpers/validateJWT";
import validateRequest from "../middlewares/validateRequest";
require("dotenv").config();
import PendingPayment, {
  E_paymentStatus,
  I_PendingPayment,
} from "../models/PendingPayment";

const router = Router();

const ADDRESS_TO = process.env.COMPANY_WALLET_ADDRESS;

router.post(
  "/payment/:userId",
  [
    validateJWT,
    check("userId", "invalid userId"),
    check("order_id", "invalid order_id").isNumeric(),
    check("amout", "invalid amount").isNumeric(),
    check("fromAddress", "invalid wallet address format").isEthereumAddress(),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { order_id, amount, fromAddress } = req.body;
    const userId = req.params.userId;

    const pendingPayment: I_PendingPayment = {
      idUser: userId,
      amount: amount,
      creationDate: new Date(),
      idOrder: order_id,
      paymentStatus: E_paymentStatus.pending,
      addressFrom: fromAddress,
      addressTo: ADDRESS_TO,
    };
    try {
      await PendingPayment.create(pendingPayment);
      return res.status(200).end();
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  }
);

export default router;
