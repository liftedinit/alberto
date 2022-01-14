import { Action } from ".";
import { Account } from "../store/accounts";
import { Server } from "../store/servers";
import { Amount } from "../store/balances";
import { Receiver } from "../store/receivers";
import { Uint8Array2Hex } from "../helper/convert";

export type TransactionId = number;

export interface Transaction {
  server: Server;
  amount: Amount;
  symbol: string;
  receiver: Receiver;
  from?: Account;
};

export interface TransactionDetails {
  uid: string,
  amount: Amount;
  symbol: string;
  from?: string,
  to: string,
  timestamp: Date;
}

export interface TransactionState {
  newTransaction: Transaction;
  byTransactionId: Map<TransactionId, TransactionDetails>;
};

export const initialTransactionState = {
  newTransaction: {
    server: {
      name: "Localhost",
      url: "/api"
    },
    amount: BigInt(0),
    symbol: "",
    receiver: {
      name: "",
    },
    from: {
      name: "",
      identity: null,
    }
  },
  byTransactionId: new Map<TransactionId, TransactionDetails>(),
};

export const transactionReducer = (
  state: TransactionState,
  { type, payload }: Action
) => {
  switch (type) {
    case "TRANSACTION.CREATE": {
      const newTransaction = payload;
      return { ...state, newTransaction }
    }
    case "TRANSACTION.SENT": {
      return { ...state, initialTransactionState}
    }
    case "TRANSACTION.LIST": {
      const transactionPayload = payload[1];
            
      let byTransactionId = new Map<TransactionId, TransactionDetails>();

      transactionPayload?.forEach((transaction: any, transactionId: TransactionId) => {      
        const uid = transaction.has(0)? Uint8Array2Hex(transaction.get(0)) : '';  
        const timestamp: any = transaction.has(1) ? transaction.get(1) : null;
        const details = transaction.has(2) ? transaction.get(2) : [];
 
        if (details.length === 5) {
          const from: string = Uint8Array2Hex(details[1]);
          const to: string = Uint8Array2Hex(details[2]);
          const symbol: string = details[3];
          const amount: Amount = details[4];

          const detail: TransactionDetails = { uid, amount, symbol, from, to, timestamp };
          byTransactionId.set(transactionId, detail);
        }
      });
      return { ...state, byTransactionId};
    }
    default:
      return state;
  }
}
