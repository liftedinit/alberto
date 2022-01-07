import omni from "omni";
import { Identity } from "omni/dist/identity";
import { Transaction } from "../store/transactions";

export const parseIdentity = (keys: Identity) => {
  if (keys === null) {
    return '<oaa>'
  }
  return `<${omni.identity.toString(keys)}>`
}

export const createSendArugments = (transaction: Transaction) => {
  let result = new Map<number, any>();
  const fromIdentity: Identity = transaction.from.identity;
  const destinationIdentity: Identity = transaction.receiver.identity;
  const amount: number = transaction.amount;
  const symbol: string = transaction.symbol;  
  result.set(0, fromIdentity);
  result.set(1, destinationIdentity);
  result.set(2, amount);
  result.set(3, symbol);
  return result;
}