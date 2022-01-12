import { Action } from "../store";
import { Amount, SymbolId } from "../store/balances";
import { ReceiverId } from "../store/receivers";
import { Uint8Array2Hex } from "../helper/convert";

export type TransactionId = number;

export interface Transaction {
  amount: Amount;
  receiverId?: ReceiverId;
  symbol?: SymbolId;
}

export interface TransactionDetails {
  amount: Amount;
  symbol: string;
  from?: string;
  to: string;
  timestamp: Date;
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

      transactionPayload?.forEach(
        (transaction: any, transactionId: TransactionId) => {
          // const uid = Uint8Array2Hex(transaction[0]);
          const timestamp: any = transaction[1];
          const details = transaction[2];

          const from: string = Uint8Array2Hex(details[1].value);
          const to: string = Uint8Array2Hex(details[2].value);
          const symbol: string = details[3];
          const amount: Amount = details[4];

          const detail: TransactionDetails = {
            amount,
            symbol,
            from,
            to,
            timestamp,
          };
          byTransactionId.set(transactionId, detail);
        }
      );
      return { ...state, byTransactionId };
    }
    default:
      return state;
  }
};
