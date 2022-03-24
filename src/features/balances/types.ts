import { NetworkId } from "features/network";

export type SymbolId = string;

export type Amount = bigint;

export type Balances = { [index: SymbolId]: Amount };
