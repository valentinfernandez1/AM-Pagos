import get_paymentById from "./get_paymentById";
import get_payments from "./get_payments";
import get_txHistory from "./get_txHistory";
import post_registerPayment from "./post_registerPayment";
import put_verifyPayment from "./put_verifyPayment";

import utility from "./utility";

export default {
  paymentRoutes: [
    get_paymentById,
    get_payments,
    post_registerPayment,
    put_verifyPayment,
    get_txHistory,
  ],
  utilityRoutes: [utility],
};
