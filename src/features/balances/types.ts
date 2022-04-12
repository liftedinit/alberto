export type SymbolId = string;

export type Amount = bigint;

export type Balances = { [index: SymbolId]: Amount };

export interface Asset {
  identity: string
  symbol: string
  balance: bigint
}