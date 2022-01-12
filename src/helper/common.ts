import omni from "omni";
import { Identity } from "omni/dist/identity";
import { Account } from "../store/accounts";

export const parseIdentity = (key: any): string => {
  if (key === undefined) {
    return "<oaa>";
  }
  const identity: Identity = omni.identity.fromPublicKey(key);

  return `<${omni.identity.toString(identity)}>`;
};

export const getAddressFromHex = (hex: any): string => {
  const identity: Identity = omni.identity.fromHex(hex);
  return omni.identity.toString(identity);
};

export function displayId(account: Account): string {
  if (!account.keys) {
    return `<${omni.identity.toString()}>`;
  }
  const identity = omni.identity.fromPublicKey(account.keys.publicKey);
  const idString = omni.identity.toString(identity);
  return `<${idString.slice(0, 4)}...${idString.slice(-4)}>`;
}
