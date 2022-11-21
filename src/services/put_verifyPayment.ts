import { Router } from "express";
import { Request, Response, NextFunction } from "express";
import verifyTxHash from "../helpers/verifyTxHash";
import PendingPayment, {
  E_paymentStatus,
  I_PendingPayment,
} from "models/PendingPayment";
import { publish } from "../rabbit/rabbitRepo";
import validateJWT from "../helpers/validateJWT";

const router = Router();

//Define routes Here
router.put(
  "/payment/:userId",
  [validateJWT],
  async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId, tx_hash } = req.body;

    const pendingPayment: I_PendingPayment = await PendingPayment.findOne({
      _id: paymentId,
    }).lean();

    if (pendingPayment.paymentStatus != E_paymentStatus.pending) {
      return res.status(400).json({
        msg: `Invalid payment. The status of the received payment is: ${pendingPayment.paymentStatus}`,
      });
    }

    const verificationResponse = await verifyTxHash(tx_hash, pendingPayment);

    if (!verificationResponse) {
      return res.status(400).json({
        msg: `Invalid payment. ${verificationResponse.error}`,
      });
    }

    let updatedPayment: I_PendingPayment = { ...pendingPayment };
    updatedPayment.paymentDate = new Date();
    updatedPayment.paymentStatus = E_paymentStatus.verified;
    updatedPayment.txHash = tx_hash;

    await PendingPayment.updateOne({ _id: pendingPayment._id }, updatedPayment);

    res
      .status(200)
      .json({ msg: "Transaction confirmed", payment: updatedPayment });

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
