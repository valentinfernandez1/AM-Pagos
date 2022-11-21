import mongoose, { mongo } from "mongoose";

export interface I_PendingPayment {
  _id?: string;
  idOrder: string;
  amount: number;
  idUser: string;
  creationDate: Date;
  txHash?: string;
  paymentDate?: Date;
  paymentStatus: E_paymentStatus;
  addressFrom: string;
  addressTo: string;
}

export enum E_paymentStatus {
  pending = "pending",
  verified = "verified",
  canceled = "canceled",
}

const PendingPaymentSchema = new mongoose.Schema({
  idOrder: { type: String, required: true },
  amount: {
    type: mongoose.Schema.Types.Number,
    required: true,
  },
  idUser: { type: String, required: true },

  creationDate: {
    type: Date,
    required: true,
    default: new Date(),
  },
  txHash: {
    type: String,
    required: false,
  },
  paymentDate: {
    type: Date,
    required: false,
    default: new Date(),
  },
  paymentStatus: { type: String, enum: E_paymentStatus },
  addressFrom: {
    type: String,
    required: true,
  },
  addressTo: {
    type: String,
    required: true,
  },
});

export default mongoose.model("PendingPayment", PendingPaymentSchema);
