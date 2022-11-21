import { Request, Response, NextFunction, Router } from "express";
import { check } from "express-validator";
import fieldVerifications from "../helpers/fieldVerifications";
import validateRequest from "../middlewares/validateRequest";
import { E_Sort } from "../utils/enums";
import validateJWT from "../helpers/validateJWT";
import PendingPayment, { I_PendingPayment } from "../models/PendingPayment";

const router = Router();

const BASE_DATE = new Date(1900, 0, 1);

router.get(
  "/payment/:userId",
  [
    /* validateJWT, */
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
      })
        .sort({ creationDate: sorting })
        .lean();

      let paymentsDTO: I_PendingPayment[] = [];
      paymentsDTO = payments.map((payment): I_PendingPayment => {
        const paymentDTO: I_PendingPayment = {
          _id: payment._id,
          idOrder: payment.idOrder,
          addressFrom: payment.addressFrom,
          addressTo: payment.addressTo,
          amount: payment.amount,
          creationDate: payment.creationDate,
          idUser: payment.idUser,
          paymentStatus: payment.paymentStatus,
        };
        return paymentDTO;
      });

      res
        .status(200)
        .json({ amountPayments: paymentsDTO.length, payments: paymentsDTO });
    } catch (error) {}
  }
);

export default router;
