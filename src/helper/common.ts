import { Identity } from "many";
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

export function displayId(account: Account): string {
  if (!account.keys) {
    return `<oaa>`;
  }
  const identity = Identity.fromPublicKey(account.keys.publicKey);
  const idString = identity.toString();
  return `<${idString.slice(0, 4)}...${idString.slice(-4)}>`;
}
