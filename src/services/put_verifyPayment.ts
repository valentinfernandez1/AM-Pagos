import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import verifyTxHash from "../helpers/verifyTxHash";
import PendingPayment, {
  E_paymentStatus,
  I_PendingPayment,
} from "../models/PendingPayment";
import { publish } from "../rabbit/rabbitRepo";
import validateJWT from "../helpers/validateJWT";
import { check } from "express-validator";

const router = Router();

//Define routes Here
router.put(
  "/payment/:userId",
  [
    /* [validateJWT], */ check(
      "paymentId",
      "Invalid paymentId format"
    ).isString(),
    check("tx_hash").isString(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId, tx_hash } = req.body;
    let updatedPayment: I_PendingPayment;
    try {
      const pendingPayment: I_PendingPayment = await PendingPayment.findOne({
        _id: paymentId,
      }).lean();

      if (pendingPayment.paymentStatus != E_paymentStatus.pending) {
        return res.status(400).json({
          msg: `Invalid payment. The status of the received payment is: ${pendingPayment.paymentStatus}`,
        });
      }

      const verificationResponse = await verifyTxHash(tx_hash, pendingPayment);

      if (!verificationResponse.result) {
        return res.status(400).json({
          msg: `Invalid payment. ${verificationResponse.error}`,
        });
      }

      updatedPayment = { ...pendingPayment };
      updatedPayment.paymentDate = new Date();
      updatedPayment.paymentStatus = E_paymentStatus.verified;
      updatedPayment.txHash = tx_hash;

      await PendingPayment.updateOne(
        { _id: pendingPayment._id },
        updatedPayment
      );

      res
        .status(200)
        .json({ msg: "Transaction confirmed", payment: updatedPayment });
    } catch (error) {
      res.status(500).json(error);
    }

    const rabbitMessage = {
      orderId: updatedPayment.idOrder,
      userId: updatedPayment.idUser,
      paymentMethod: "Blockchain",
      paymentInfo: {
        fromAddress: updatedPayment.addressFrom,
        amount: updatedPayment.amount,
        txHash: updatedPayment.txHash,
        paymentDate: updatedPayment.paymentDate,
        network: "BSC - Testnet",
      },
    };
    try {
      publish("payment", JSON.stringify(rabbitMessage));
    } catch (error) {
      console.log(error);
      return;
    }
  }
);

export default router;
