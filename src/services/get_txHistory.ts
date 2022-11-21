import { Request, Response, NextFunction, Router } from "express";
import { check } from "express-validator";
import fieldVerifications from "../middlewares/fieldVerifications";
import validateRequest from "../middlewares/validateRequest";
import PendingPayment, {
  E_paymentStatus,
  I_PendingPayment,
} from "../models/PendingPayment";
import { E_Sort } from "../utils/enums";

const router = Router();
const BASE_DATE = new Date(1900, 0, 1);

router.get(
  "/txHistory/:userId",
  [
    /* validateJWT, */
    check("userId", "Invalid userId format").isNumeric(),
    check("sort").custom(fieldVerifications.sortEnum),
    validateRequest,
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.userId;
    const { dateFrom, dateTo, sort } = req.query;

    let from, to, sorting;
    dateFrom ? (from = dateFrom) : (from = BASE_DATE);
    dateTo ? (to = dateTo) : (to = new Date());
    sort
      ? (sorting = (E_Sort as any)[String(sort).toLowerCase()])
      : (sorting = E_Sort.ascending);

    try {
      const payments: I_PendingPayment[] = await PendingPayment.find({
        idUser: userId,
        creationDate: {
          $gte: from,
          $lt: to,
        },
        paymentStatus: {
          $ne: E_paymentStatus.pending,
        },
      })
        .sort({ creationDate: sorting })
        .lean();

      let txHistoryDTO: Partial<I_PendingPayment>[] = [];
      txHistoryDTO = payments.map((tx): Partial<I_PendingPayment> => {
        const paymentDTO: Partial<I_PendingPayment> = {
          idOrder: tx.idOrder,
          addressFrom: tx.addressFrom,
          addressTo: tx.addressTo,
          amount: tx.amount,
          paymentDate: tx.paymentDate,
          txHash: tx.txHash,
          idUser: tx.idUser,
          paymentStatus: tx.paymentStatus,
        };
        return paymentDTO;
      });

      res
        .status(200)
        .json({ amountPayments: txHistoryDTO.length, payments: txHistoryDTO });
    } catch (error) {}
  }
);

export default router;
