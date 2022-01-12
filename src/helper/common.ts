import omni from "omni";
import { Identity } from "omni/dist/identity";

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
