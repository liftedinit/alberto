import { Identity } from "many-js";
import { Account } from "../store/accounts";

export const parseIdentity = (key: any): string => {
  if (key === undefined) {
    return "<oaa>";
  }
  const identity = Identity.fromPublicKey(key);

  return `<${identity.toString()}>`;
};

export const getAddressFromHex = (hex: any): string => {
  const identity = Identity.fromHex(hex);
  return identity.toString();
};

const makeShortId = (idString: string): string =>
  `<${idString.slice(0, 4)}...${idString.slice(-4)}>`

export function displayId(account: Account): { full: string; short: string } {
  if (!account.keys) {
    return { full: "", short: `<oaa>` }
  }
  const identity = Identity.fromPublicKey(account.keys.publicKey)
  const idString = identity.toString()
  return { full: idString, short: makeShortId(idString) }
}