import omni from "omni";
import { Identity } from "omni/dist/identity";
import { Transaction } from "../store/transactions";
import { Amount } from "../store/balances";

export const parseIdentity = (key: any): string => {  
  if (key === undefined) {
    return '<oaa>'
  }
  const identity: Identity = omni.identity.fromPublicKey(key);

  return `<${omni.identity.toString(identity)}>`
}

export const createSendArugments = (transaction: Transaction) => {
  let result = new Map<number, any>();
  const fromIdentity = transaction.from; 
  const destinationIdentity = transaction.receiver?.publicKey;
  
  const amount: Amount = transaction.amount;
  const symbol: string = transaction.symbol;  
  result.set(0, fromIdentity);
  result.set(1, destinationIdentity);
  result.set(2, amount);
  result.set(3, symbol);
  return result;
}

export const getAddressFromHex = (hex: any): string => {
  const identity: Identity = omni.identity.fromHex(hex);
  return omni.identity.toString(identity)
}