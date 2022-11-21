import PendingPayment from "../models/PendingPayment";
import { E_Sort } from "../utils/enums";

const fieldVerifications = {
  sortEnum: (sort: string) => {
    if (sort == undefined) return true;
    let sortValidation = (E_Sort as any)[String(sort).toLowerCase()];
    if (!sortValidation) {
      throw new Error(`-- ${sort} -- is not valid for param "sort"`);
    }
  },
  orderNotRegistered: async (order_id: string) => {
    const order = await PendingPayment.find({ idOrder: order_id }).lean();

    if (order.length > 0) {
      throw new Error(`orderId ${order_id} already registered`);
    }
  },
};

export default fieldVerifications;
