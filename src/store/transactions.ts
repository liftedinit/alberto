import { Action } from "../store";
import { Amount, SymbolId } from "../store/balances";
import { ReceiverId } from "../store/receivers";
import { Uint8Array2Hex } from "../helper/convert";
import { TransactionType } from "omni/dist/types";
export type TransactionId = number;

export interface Transaction {
  amount: Amount;
  receiverId?: ReceiverId;
  symbol?: SymbolId;
}

export interface TransactionDetails {
  uid: string,
  amount: Amount;
  symbol: string;
  from?: string;
  to: string;
  timestamp: Date;
  type: TransactionType;
}

export interface TransactionState {
  newTransaction: Transaction;
  byTransactionId: Map<TransactionId, TransactionDetails>;
}

export const defaultTransaction = {
  amount: BigInt(0),
};

export const initialTransactionState = {
  newTransaction: { ...defaultTransaction },
  byTransactionId: new Map<TransactionId, TransactionDetails>(),
};

export const transactionReducer = (
  state: TransactionState,
  { type, payload }: Action
) => {
  switch (type) {
    case "TRANSACTION.CREATE": {
      const newTransaction = payload;
      return { ...state, newTransaction };
    }
    case "TRANSACTION.SENT": {
      return { ...state, newTransaction: { ...defaultTransaction } };
    }
    case "TRANSACTION.LIST": {
      const transactionPayload = payload[1];
            
      let byTransactionId = new Map<TransactionId, TransactionDetails>();

      transactionPayload?.forEach((transaction: any, transactionId: TransactionId) => {      
        const uid = transaction.has(0)? transaction.get(0) : '';  
        const timestamp: any = transaction.has(1) ? transaction.get(1) : null;
        const details = transaction.has(2) ? transaction.get(2) : [];
 
        if (details.length === 5) {
          const type: number = details[0];
          const from: string = Uint8Array2Hex(details[1]);
          const to: string = Uint8Array2Hex(details[2]);
          const symbol: string = details[3];
          const amount: Amount = details[4];

          const detail: TransactionDetails = { uid, amount, symbol, from, to, timestamp, type };
          byTransactionId.set(transactionId, detail);
        }
      });
      return { ...state, byTransactionId};
    }
    default:
      return state;
  }
};
