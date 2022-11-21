import { I_PendingPayment } from "../models/PendingPayment";
import Web3 from "web3";

import usdtABI from "../constants/usdt.json";
const InputDataDecoder = require("ethereum-input-data-decoder");

interface verifyResponse {
  result: boolean;
  error: string;
}

const verifyTxHash = async (
  tx_hash: string,
  payment: I_PendingPayment
): Promise<verifyResponse> => {
  let addressTo: string;
  let txAddressFrom: string;
  let txValueETH: number;

  let result: boolean = false,
    error: string;

  try {
    //Get Web3 provider
    const web3 = new Web3(process.env.RPC_URL);

    //Get Tx details from blockchain network
    const result = await web3.eth.getTransaction(tx_hash);

    //Decode the input field of the txResult to get the addressTo and value
    const resultDecode = decodeInput(result.input);

    //Refactor addressTo
    addressTo = "0x" + resultDecode["inputs"][0];

    //Refactor txValue
    const txValueWei = web3.utils.hexToNumberString(
      resultDecode["inputs"][1]["_hex"]
    );
    txValueETH = Number(web3.utils.fromWei(txValueWei, "ether"));

    //Compare addressFrom with txFrom of hash
    txAddressFrom = result.from;
  } catch (error) {
    console.log(error);
    return;
  }

  txAddressFrom != payment.addressFrom
    ? (error = `Incorrect address from. Received: ${txAddressFrom}`)
    : null;
  addressTo != payment.addressTo
    ? (error = `Incorrect address from. Received: ${addressTo}`)
    : null;
  if (payment.amount > txValueETH) {
    error = `transaction underpaid. Received: ${addressTo}`;
  }

  !error ? (result = true) : null;

  return {
    error,
    result,
  };
};

export default verifyTxHash;

function decodeInput(indexData: string) {
  const decoder = new InputDataDecoder(usdtABI);
  const result = decoder.decodeData(indexData);
  return result;
}
