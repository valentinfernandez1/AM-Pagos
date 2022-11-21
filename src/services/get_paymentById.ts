import { Request, Response, NextFunction, Router } from "express";
import { check } from "express-validator";
import validateJWT from "../helpers/validateJWT";
import validateRequest from "../middlewares/validateRequest";
import PendingPayment, { I_PendingPayment } from "../models/PendingPayment";

const router = Router();

router.get(
  "/payment/:userId/:paymentId",
  [
    /* validateJWT, */
    check("userId", "Invalid userId format").isNumeric(),
    check("paymentId", "Invalid paymentId format").isNumeric(),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const paymentId = req.params.paymentId;
    try {
      const payment: I_PendingPayment[] = await PendingPayment.find({
        _id: paymentId,
      }).lean();

      if (!payment) {
        res.status(400).json({ msg: "payment not found", payment: {} });
      }
      res.status(200).json({ payment: payment[0] });
    } catch (error) {
      res.status(500).json(error);
    }
  }
);

export default router;
