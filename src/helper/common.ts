import omni from "omni";
import { Identity, Key } from "omni/dist/identity";
import { Transaction } from "../store/transactions";
import { Amount } from "../store/balances";

export const parseIdentity = (keys: Identity) => {
  if (keys === null) {
    return '<oaa>'
  }
  return `<${omni.identity.toString(keys)}> - [${omni.identity.toHex(keys)}]`
}

export const createSendArugments = (transaction: Transaction) => {
  let result = new Map<number, any>();
  const fromIdentity = transaction.from.identity?.publicKey; 
  const destinationIdentity = transaction.receiver.identity?.publicKey;
  //const fromIdentity = 'oahalcttlfig5w24eh3hyaya2w3afkvua62tk3xgplksf2oynj';
  //const destinationIdentity = 'oafzdhgewz2qdmwaxj6gr4ok7rdvxrkgmpvvxwmcp7cxqasaca'

  const amount: Amount = transaction.amount;
  const symbol: string = transaction.symbol;  
  result.set(0, fromIdentity);
  result.set(1, destinationIdentity);
  result.set(2, amount);
  result.set(3, symbol);
  return result;
}